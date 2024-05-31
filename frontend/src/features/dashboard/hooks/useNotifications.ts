/*
   INFO: THE `USENOTIFICATIONS` HOOK IS USED TO MANAGE USER NOTIFICATIONS WITHIN THE APPLICATION.
   IT PROVIDES MECHANISMS TO FETCH, DISPLAY, AND MARK NOTIFICATIONS AS READ OR DELETE THEM.

   INFO: KEY FEATURES:
   - FETCHING NOTIFICATIONS FROM THE SERVER.
   - MANAGING LOCAL STATE FOR NOTIFICATIONS.
   - FUNCTIONS TO MARK NOTIFICATIONS AS READ AND DELETE THEM.
   - HANDLING NOTIFICATION DISPLAY AND INTERACTIONS.
   - PROVIDING A WAY TO FILTER AND SORT NOTIFICATIONS.

   WARN: HANDLE NOTIFICATION DATA CAREFULLY TO ENSURE NO LOSS OF IMPORTANT USER INFORMATION.
   WARN: ENSURE THE UI IS RESPONSIVE WHEN DISPLAYING A LARGE NUMBER OF NOTIFICATIONS.

   TODO: IMPLEMENT PUSH NOTIFICATIONS FOR REAL-TIME UPDATES.
   TODO: ALLOW USERS TO CUSTOMIZE NOTIFICATION PREFERENCES.
   TODO: ENHANCE THE UI FOR NOTIFICATION DISPLAY, INCLUDING GROUPED NOTIFICATIONS.

   USAGE:
      CONST { NOTIFICATIONS, MARKASREAD, DELETENOTIFICATION } = USENOTIFICATIONS();

   DEPENDENCIES:
   - REACT FOR MANAGING COMPONENT STATE.
   - TANSTACK QUERY FOR FETCHING AND UPDATING NOTIFICATION DATA.
*/