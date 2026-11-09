const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./server');
const User = require('./models/User');
const Project = require('./models/Project');

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 STARTING COMPREHENSIVE SAASFLOW MERN TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Wait for DB connection
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => mongoose.connection.once('open', resolve));
    }
    console.log('Connected to MongoDB database.');

    // Clean up test data
    await User.deleteMany({ email: { $in: ['test_free@saasflow.dev', 'test_other@saasflow.dev'] } });
    await Project.deleteMany({ title: { $regex: /^Test Project/ } });

    // 1. Test User Registration
    console.log('\n[1] Testing User Registration (POST /api/auth/register)...');
    const userAData = {
      name: 'Alice Developer',
      email: 'test_free@saasflow.dev',
      password: 'password123',
    };

    const UserModal = require('./models/User');
    const userA = await UserModal.create(userAData);
    assert(userA._id, 'User A registered successfully');
    assert(userA.subscriptionPlan === 'free', 'User A default subscription is "free"');

    const generateToken = require('./utils/generateToken');
    const tokenA = generateToken(userA._id);
    assert(tokenA && typeof tokenA === 'string', 'JWT token generated for User A');

    // 2. Test Password Matching
    console.log('\n[2] Testing Password Verification & Encryption...');
    const fetchedUserA = await UserModal.findById(userA._id).select('+password');
    const isPasswordValid = await fetchedUserA.matchPassword('password123');
    const isWrongPasswordInvalid = !(await fetchedUserA.matchPassword('wrongpass'));
    assert(isPasswordValid, 'Valid password verified by bcrypt');
    assert(isWrongPasswordInvalid, 'Incorrect password rejected');

    // 3. Test Free Tier Project Limits (Max 3 Projects)
    console.log('\n[3] Testing Project Creation & Free Tier Limit Enforcement (Max 3)...');
    const ProjectModel = require('./models/Project');

    const proj1 = await ProjectModel.create({
      title: 'Test Project 1',
      description: 'First test project',
      status: 'Planning',
      priority: 'Low',
      owner: userA._id,
    });
    assert(proj1._id, 'Project 1 created successfully for Free user');

    const proj2 = await ProjectModel.create({
      title: 'Test Project 2',
      description: 'Second test project',
      status: 'In Progress',
      priority: 'Medium',
      owner: userA._id,
    });
    assert(proj2._id, 'Project 2 created successfully for Free user');

    const proj3 = await ProjectModel.create({
      title: 'Test Project 3',
      description: 'Third test project',
      status: 'Completed',
      priority: 'High',
      owner: userA._id,
    });
    assert(proj3._id, 'Project 3 created successfully (at maximum limit)');

    const countBefore = await ProjectModel.countDocuments({ owner: userA._id });
    assert(countBefore === 3, 'User A now has exactly 3 projects');

    // Test creating 4th project via controller logic
    const { createProject } = require('./controllers/projectController');
    const mockReq = {
      user: userA,
      body: {
        title: 'Test Project 4 - Should Fail',
        description: 'Exceeds limit',
      },
    };
    let statusCode = 200;
    let responseData = null;
    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseData = data;
        return this;
      },
    };

    await createProject(mockReq, mockRes, (err) => console.error(err));
    assert(
      statusCode === 403,
      'Backend returned 403 Forbidden when Free user attempted to create 4th project'
    );
    assert(
      responseData?.limitReached === true,
      'Response explicitly flagged limitReached: true'
    );

    // 4. Test Ownership Authorization
    console.log('\n[4] Testing Ownership Authorization Security...');
    const userB = await UserModal.create({
      name: 'Bob Intruder',
      email: 'test_other@saasflow.dev',
      password: 'password123',
    });

    const { getProjectById, deleteProject } = require('./controllers/projectController');
    let userBAccessCode = 200;
    const mockUserBRes = {
      status(code) {
        userBAccessCode = code;
        return this;
      },
      json(data) {
        return this;
      },
    };

    // User B tries to view User A's project
    await getProjectById({ user: userB, params: { id: proj1._id } }, mockUserBRes, () => {});
    assert(
      userBAccessCode === 403,
      'User B was blocked (403 Forbidden) from viewing User A project'
    );

    // User B tries to delete User A's project
    let userBDeleteCode = 200;
    const mockUserBDeleteRes = {
      status(code) {
        userBDeleteCode = code;
        return this;
      },
      json(data) {
        return this;
      },
    };
    await deleteProject({ user: userB, params: { id: proj1._id } }, mockUserBDeleteRes, () => {});
    assert(
      userBDeleteCode === 403,
      'User B was blocked (403 Forbidden) from deleting User A project'
    );

    // 5. Test Simulated Subscription Upgrade to Pro
    console.log('\n[5] Testing Subscription Upgrade to Pro Tier...');
    const { upgradeSubscription } = require('./controllers/subscriptionController');
    let upgradeStatus = 200;
    let upgradeData = null;
    const mockUpgradeRes = {
      status(code) {
        upgradeStatus = code;
        return this;
      },
      json(data) {
        upgradeData = data;
        return this;
      },
    };

    await upgradeSubscription({ user: userA, body: { plan: 'pro' } }, mockUpgradeRes, () => {});
    assert(upgradeStatus === 200, 'Upgrade request succeeded with 200 OK');
    assert(upgradeData?.subscription?.isPro === true, 'User A is now PRO');

    // 6. Test Pro User Creating Unlimited Projects (Creating 4th project)
    console.log('\n[6] Testing Pro User Creating Beyond 3 Projects (Unlimited Limit)...');
    userA.subscriptionPlan = 'pro';
    let proCreateCode = 200;
    let proCreateData = null;
    const mockProCreateRes = {
      status(code) {
        proCreateCode = code;
        return this;
      },
      json(data) {
        proCreateData = data;
        return this;
      },
    };

    await createProject(
      {
        user: userA,
        body: {
          title: 'Test Project 4 - Pro Unlimited',
          description: 'Successfully created under Pro plan',
        },
      },
      mockProCreateRes,
      () => {}
    );
    assert(proCreateCode === 201, 'Pro user successfully created 4th project (201 Created)');
    assert(proCreateData?.project?.title === 'Test Project 4 - Pro Unlimited', 'Project title matches');

    // 7. Test Aggregated Dashboard Stats
    console.log('\n[7] Testing Dashboard Stats Aggregation...');
    const { getDashboardStats } = require('./controllers/dashboardController');
    let statsStatus = 200;
    let statsData = null;
    const mockStatsRes = {
      status(code) {
        statsStatus = code;
        return this;
      },
      json(data) {
        statsData = data;
        return this;
      },
    };

    await getDashboardStats({ user: userA }, mockStatsRes, () => {});
    assert(statsStatus === 200, 'Dashboard stats returned successfully');
    assert(statsData?.stats?.totalProjects === 4, 'Stats total projects count is 4');
    assert(statsData?.stats?.isPro === true, 'Stats indicates Pro status');
    assert(statsData?.stats?.remainingSlots === 'Unlimited', 'Remaining slots shows "Unlimited" for Pro');

    // Clean up
    await User.deleteMany({ email: { $in: ['test_free@saasflow.dev', 'test_other@saasflow.dev'] } });
    await Project.deleteMany({ title: { $regex: /^Test Project/ } });

    console.log('\n======================================================');
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
}

runTestSuite();
