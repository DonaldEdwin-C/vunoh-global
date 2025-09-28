import { createStore } from 'vuex';
import auth from './auth';
import admin from './admin';
import listings from './listings';
import provider from './provider';
import clientListings from './clientListings';
import requests from './requests';
import users from './users';
import providerRequest from './providerRequest';
import reviews from './reviews';


export default createStore({
  modules: {
    auth,
    admin,
    listings,
    provider,
    clientListings,
    requests,
    users,
    providerRequest,
    reviews

  },
});
