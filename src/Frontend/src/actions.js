// src/routes/AuthRoute.jsx
import { redirect } from 'react-router-dom';
import store from './store/index';
import { userActions } from './store/user-slice';
import { apiFetch } from './utils/api';

export async function authAction({ request }) {
  const form = await request.formData();
  const mode = new URL(request.url).searchParams.get('mode');
  const endpoint = mode === 'signup' ? '/user/signup' : '/user/login';

  const res = await fetch('http://localhost:5000' + endpoint, {
    method: 'POST',
    credentials: 'include',                 // so refresh cookie is set
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(form))
  });
  if (!res.ok) throw new Error('Auth failed');

  if (mode === 'login') {
    const { accessToken } = await res.json();
    // Decode minimal user from the JWT payload

    localStorage.setItem('accessToken', accessToken);

    const userResponse = await apiFetch('http://localhost:5000/user/profile');

    const userData = await userResponse.json();

    const user = {
      _id: userData._id,
      email: userData.email,
      channelName: userData.channelName,
      channelImageURL: userData.channelImageURL
    };
    store.dispatch(userActions.addUser(user));
    return redirect('/');
  } else {
    return redirect('/auth?mode=login');
  }
}
