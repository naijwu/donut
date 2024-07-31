
import express from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import queryString from 'query-string'
import { checkUser, createProfile } from '../services/authService.js';

const router = express.Router();

export const config = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authUri: 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: 'https://oauth2.googleapis.com/token',
    redirectUrl: process.env.REDIRECT_URL,
    clientUrl: process.env.CLIENT_URL,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: 36000000, // default in milliseconds - 1 hour
    postUrl: 'https://jsonplaceholder.typicode.com/posts'
}

// these scopes don't need verification
const authScope = [
    'openid', 
    'profile',
    'email'
]

// step 1: auth code
const authParams = queryString.stringify({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: 'code',
    scope: authScope.join(' '),
    access_type: 'offline',  
    state: 'standard_oauth',
    prompt: 'consent',
  });

// step 2: auth token
const getTokenParams = (code) => queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUrl,
});

router.get('/url', (_, res) => {
    // console.log('/auth/url hit')
    res.json({
      url: `${config.authUri}?${authParams}`,
    });
});

router.get('/token', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({
        message: 'Authorization code must be provided'
    })

    try {
        // verify auth code
        const tokenParam = getTokenParams(code);

        // auth code for access token
        const { data: { access_token, expires_in, refresh_token, scope, token_type, id_token} } = await axios.post(`${config.tokenUri}?${tokenParam}`);
        if (!id_token || !access_token) return res.status(400).json({ message: 'Auth error'});

        // get user info from id token
        const user = jwt.decode(id_token);

        // keep db up to date
        const existingProfile = await checkUser(user.email);
        if (existingProfile == 0) {
            // create new user
            await createProfile(user);
        } 

        // sign a new token
        const token = jwt.sign({ 
                user: { 
                    ...user, 
                    accessTokenExpiry: (new Date()).getTime() + expires_in 
                } },
                config.tokenSecret, 
                { 
                    expiresIn: config.tokenExpiration 
                });

        // set cookies
        res.cookie('token', token, { httpOnly: false })
        res.cookie('accessToken', access_token);
        res.json({ user })
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).json({
            message: err.message || 'Server error'
        })
    }
})

router.get('/logged_in', async (req, res) => {
    try {
        // get token from cookie
        // console.log('/auth/logged_in hit')
        const token = req.cookies.token;
        if (!token) return res.json({
            loggedIn: false
        })
        const { user } = jwt.verify(token, config.tokenSecret);
        
        // reset token in cookie (reset time to expiration to 1 hour)
        const newToken = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration })
        res.cookie('token', newToken, { httpOnly: true })

        res.json({
            loggedIn: true,
            user
        })
    } catch (err) {
        res.json({
            loggedIn: false
        })
    }
})

router.post('/logout', async (_, res) => {
    // clear cookie
    res.clearCookie('accessToken');
    res.clearCookie('token').json({
        message: 'Logged out'
    })
})

export default router;