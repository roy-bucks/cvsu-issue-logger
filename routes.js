const express = require("express");
const router = express.Router();

const portalController = require(`./controllers/portal`);
const userController = require('./controllers/users'); 
const AdminController = require('./controllers/admin'); 
const setupController = require("./controllers/setup");
const adminTicketController = require("./controllers/adminTicket");

//Middle ware 
const { user, admin, home, setup, auth} = require("./middleware/main");


/******************Portal**********************/
//logout
router.get("/logout", portalController.logout);

router.get("/",setup,home,  portalController.portal);
router.post("/user/login",home, portalController.login);
router.get("/user/login/barier/:userId",home,  portalController.barier);
router.post("/user/entry",home,  portalController.entry);
router.get("/user/admin/auth/:email", home, portalController.admin_auth);
router.post("/user/admin/auth", home, portalController.admin_login);


/******************User**********************/
router.get("/user/ticket/create",user, userController.createTicket);
router.get("/user/ticket/view",user,  userController.viewTicket);
router.post("/user/ticket/submit",user, userController.fileUploadMiddleware, userController.submitTicket);
router.post("/user/ticket/active/count",  user, userController.activeTickets);
router.post("/user/tickets/all", user, userController.getAllTickets); 


router.post("/user/profile", user, userController.getProfile); 

/******************Admin**********************/

//Admin tickets
//All new tickets 
router.get("/admin/ticket/all",admin,  adminTicketController.new_tickets); 
router.post("/admin/tickets/count", admin, adminTicketController.count); 
router.post("/admin/tickets/get/new", admin, adminTicketController.getAlNew);
router.post("/admin/ticket/view-process",admin, adminTicketController.getTicketData);
router.post("/admin/ticket/process", admin, adminTicketController.processTicket);
router.post("/admin/ticket/update/process", admin, adminTicketController.updateProcess);

router.post("/admin/ticket/set-check/",admin,adminTicketController.setCheckTicket);
router.post("/admin/ticket/disactive", admin, adminTicketController.ticketDisactivate); 

//On Hold tickets on admin
router.get("/admin/ticket/on-hold",admin, adminTicketController.getOnHold); 
router.post("/admin/tickets/get/on_hold",admin, adminTicketController.getOnHoldTickets); 

//In close tickets on admin
router.get("/admin/ticket/in-close", admin, adminTicketController.getInClose); 
router.post("/admin/tickets/get/in_close", admin, adminTicketController.getInCloseTickets);

//All tickets
router.get("/admin/ticket/all-tickets", admin, adminTicketController.adminGetAllTicket);
router.post("/admin/tickets/get/all", admin, adminTicketController.getAllTickets)

//Admin account registration
router.get("/admin/account/register", admin, AdminController.registerAccount); 
router.post("/admin/account/register", admin,  AdminController.crateAccount); 
router.post("/admin/account/email-listener", admin, AdminController.emailListener);


router.post("/ticket/search", admin, adminTicketController.searchTicket); 



//View all the users
router.get("/admin/account/team",admin,  AdminController.viewAccounts);

//Admin main account
router.get("/admin/account/admin",admin, AdminController.viewAdmin); 
router.post("/admin/account/update/credentials", admin, AdminController.updateAdmin); 
router.post("/admin/account/get-email", admin, AdminController.getEmail); 


//admin profile details
router.post("/admin/self/profile", admin, AdminController.selfProfile);
router.post("/admin/users/all", admin, AdminController.getAllUsers);
router.post("/admin/user/delete", admin, AdminController.deleteUsers); 


//setup router
router.get("/setup/start",home, setupController.start);
router.get("/setup/admin",home, setupController.adminSetup);
router.post("/setup/confirm",home, setupController.auth);
router.get("/setup/admin/:code",home,  setupController.setup);
router.post("/admin/account/register-admin",home,  AdminController.adminRegister);

//user view ticket
router.post("/user/ticket/view-process",user, adminTicketController.getTicketData);


router.post("/ticket/track",auth,  adminTicketController.trackTicket);


module.exports = router;
