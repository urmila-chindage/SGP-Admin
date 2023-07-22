import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import DashboardView from 'src/views/reports/DashboardView';
import NotFoundView from 'src/views/errors/NotFoundView';
import StaffList from 'src/views/staff/StaffListView';
import HighlightListView from './views/Highlight/HighlightListView';
import AchivementsListView from './views/achivements/AchivementListView';
import ActivitiesListView from './views/activities/ActivitiesListView';
import UpdateListView from './views/updates/UpdateListView';
import CalendarList from './views/calendar/CalendarListView';
import PublicationsList from './views/publications';
import TestimonialsList from './views/testimonials';
import Committee from './views/committee';
import LoginView from './views/auth/LoginView';
import firebase from 'firebase';
import NewsList from './views/News';
import EmailView from './views/email';
import Library from './views/Library';
import Placement from './views/Placement';
import ResultnLetter from './views/ResultnLetter';
// import LoginView from 'src/views/auth/LoginView';
// import RegisterView from 'src/views/auth/RegisterView';
// import SettingsView from 'src/views/settings/SettingsView';

var firebaseConfig = {
  apiKey: 'AIzaSyDVeLkjATQjtXIflpTDeiXm_aF1Zhi2JeY',
  authDomain: 'sgpoly-86d3b.firebaseapp.com',
  databaseURL: 'https://sgpoly-86d3b.firebaseio.com',
  projectId: 'sgpoly-86d3b',
  storageBucket: 'sgpoly-86d3b.appspot.com',
  messagingSenderId: '458948463598',
  appId: '1:458948463598:web:2105f46135e0eca4a01cff',
  measurementId: 'G-HHH8SQL2V4'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'updates', element: <UpdateListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'staff', element: <StaffList /> },
      { path: 'highlights', element: <HighlightListView /> },
      { path: 'achivements', element: <AchivementsListView /> },
      { path: 'activities', element: <ActivitiesListView /> },
      { path: 'academicCalender', element: <CalendarList /> },
      { path: 'publication', element: <PublicationsList /> },
      { path: 'testimonial', element: <TestimonialsList /> },
      { path: 'committee', element: <Committee /> },
      { path: 'news', element: <NewsList /> },
      { path: 'library', element: <Library /> },
      { path: 'placement', element: <Placement /> },
      { path: 'resultnletter', element: <ResultnLetter /> },
      { path: 'email', element: <EmailView /> },
      // { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: 'login', element: <LoginView /> },
      // { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
