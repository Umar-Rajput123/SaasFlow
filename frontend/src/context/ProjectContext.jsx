import React, { createContext, useContext, useState, useCallback } from 'react';
import { projectService, dashboardService, subscriptionService } from '../services/api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const { updateUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, duration);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch all projects with optional query params
  const fetchProjects = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await projectService.getProjects(params);
      if (data.success) {
        setProjects(data.projects);
      }
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch projects';
      showToast(msg, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Fetch single project by ID
  const fetchProjectById = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await projectService.getProjectById(id);
      if (data.success) {
        setCurrentProject(data.project);
      }
      return data.project;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to load project details';
      showToast(msg, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Create new project
  const createProject = useCallback(async (projectData) => {
    try {
      const data = await projectService.createProject(projectData);
      if (data.success) {
        setProjects((prev) => [data.project, ...prev]);
        showToast('Project created successfully!', 'success');
      }
      return data;
    } catch (error) {
      const isLimitReached = error.response?.data?.limitReached;
      const msg = error.response?.data?.message || 'Failed to create project';
      showToast(msg, 'error');
      // Return error payload with limit flag so UI can display Upgrade prompt
      return {
        success: false,
        limitReached: isLimitReached,
        message: msg,
      };
    }
  }, [showToast]);

  // Update existing project
  const updateProject = useCallback(async (id, projectData) => {
    try {
      const data = await projectService.updateProject(id, projectData);
      if (data.success) {
        setProjects((prev) =>
          prev.map((proj) => (proj._id === id ? data.project : proj))
        );
        if (currentProject?._id === id) {
          setCurrentProject(data.project);
        }
        showToast('Project updated successfully!', 'success');
      }
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update project';
      showToast(msg, 'error');
      throw error;
    }
  }, [currentProject, showToast]);

  // Delete project
  const deleteProject = useCallback(async (id) => {
    try {
      const data = await projectService.deleteProject(id);
      if (data.success) {
        setProjects((prev) => prev.filter((proj) => proj._id !== id));
        if (currentProject?._id === id) {
          setCurrentProject(null);
        }
        showToast('Project deleted successfully!', 'success');
      }
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete project';
      showToast(msg, 'error');
      throw error;
    }
  }, [currentProject, showToast]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await dashboardService.getStats();
      if (data.success) {
        setStats(data.stats);
      }
      return data;
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch subscription details
  const fetchSubscription = useCallback(async () => {
    try {
      const data = await subscriptionService.getSubscription();
      if (data.success) {
        setSubscription(data.subscription);
      }
      return data;
    } catch (error) {
      console.error('Failed to load subscription status:', error);
    }
  }, []);

  // Upgrade or switch plan
  const upgradeSubscription = useCallback(async (targetPlan = 'pro') => {
    try {
      const data = await subscriptionService.upgradeSubscription(targetPlan);
      if (data.success) {
        setSubscription(data.subscription);
        updateUser({ subscriptionPlan: data.user.subscriptionPlan });
        showToast(data.message, 'success');
        // Refresh stats
        fetchStats();
      }
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to upgrade subscription';
      showToast(msg, 'error');
      throw error;
    }
  }, [fetchStats, showToast, updateUser]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        stats,
        subscription,
        loading,
        statsLoading,
        toast,
        showToast,
        closeToast,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProject,
        deleteProject,
        fetchStats,
        fetchSubscription,
        upgradeSubscription,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
