const express = require('express')
const router = express.Router()
const { jwt_auth, user_role_auth} = require('../middleware/auth_middleware');

const { upload } = require('../helper/uploads');

const userdashboardController = require('../controller/user_controller/user_dashboard')
const userplacementController = require('../controller/user_controller/placement')
const userprofileController = require('../controller/user_controller/profile')
const userstudentsController = require('../controller/user_controller/students')
const useraspirantsController = require('../controller/user_controller/aspirants')
const usersettingsController = require('../controller/user_controller/settings')
const usermeetupsController = require('../controller/user_controller/meetups/meetups_pages')
const usercreateeventController = require('../controller/user_controller/meetups/create_event')
const userjobController = require('../controller/user_controller/user_job_listings')
const usermcqController = require('../controller/user_controller/mcq_controller')
const usertechnicalController = require('../controller/user_controller/technical_controller')
const userassessmentController = require('../controller/user_controller/assessment')
const userhrController = require('../controller/user_controller/hr_controller')
const usercodingController = require('../controller/user_controller/coding_controller');

const { uploadResume, parseResume } = require('../controller/user_controller/resume_controller');
const resumemulter = require('../helper/resume_multer');

router.post('/upload-resume', resumemulter.single('resume'), uploadResume);
router.post('/parse-resume', parseResume);

const multerConfig = require('../helper/video_multer');
router.post('/upload-video', multerConfig.single('video'));

router.post('/mcq', jwt_auth, usermcqController.submitMCQ);
router.get('/mcq', jwt_auth, usermcqController.mcq_page);


router.post('/technical', jwt_auth, usertechnicalController.submitTechnical);
router.get('/technical', jwt_auth, usertechnicalController.technical_page);

router.post('/hr', jwt_auth, userhrController.submithr);
router.get('/hr', jwt_auth, userhrController.hr_page);

router.get('/coding', jwt_auth, usercodingController.coding_page);
router.post('/compile', jwt_auth, usercodingController.compileCode);
// router.get('/coding', usercodingController.coding_page);
// router.post('/compile', usercodingController.compileCode);

router.get('/user_dashboard', jwt_auth, user_role_auth, userdashboardController.dashboard_page);

router.get('/user_job_listings', jwt_auth, userjobController.user_job_listings_page);

router.get('/assessment', jwt_auth, userassessmentController.assessment_page);

router.get('/placement', jwt_auth, userplacementController.placement_page);
router.post('/placement', upload.single('Payment_Screenshot'), userplacementController.placement);

router.get('/profile', jwt_auth, userprofileController.profile_page);
router.post('/profile', jwt_auth, userprofileController.profile);

router.get('/settings', jwt_auth, user_role_auth, usersettingsController.settings_page);

router.get('/meetups', jwt_auth, user_role_auth, usermeetupsController.meetups_page);

router.get('/create_event', jwt_auth, user_role_auth, usermeetupsController.create_event_page);
router.post('/create_event', jwt_auth, upload.single('event_poster'), usercreateeventController.create_event);

router.get('/events_explorer', jwt_auth, user_role_auth, usermeetupsController.events_explorer_page);

router.get('/my_events', jwt_auth, user_role_auth, usermeetupsController.my_events_page);



router.get('/engineering_students', jwt_auth, userstudentsController.engineering_students_page);
router.get('/placement', jwt_auth, userstudentsController.placement_page);
router.get('/higher_study_guidance', jwt_auth, userstudentsController.higher_study_guidance_page);
router.get('/workshops', jwt_auth, userstudentsController.workshops_page);



router.get('/engineering_aspirants', jwt_auth, useraspirantsController.engineering_aspirants_page);
router.get('/entrance_exams', jwt_auth, useraspirantsController.entrance_exams_page);
router.get('/college_rankings', jwt_auth, useraspirantsController.college_rankings_page);
router.get('/explore_branches', jwt_auth, useraspirantsController.explore_branches_page);




module.exports = router