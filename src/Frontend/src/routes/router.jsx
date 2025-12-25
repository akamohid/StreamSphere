import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import HomePage, { loader as HomeLoader } from "../pages/HomePage";
import RootPage, { loader as userLoader } from "../pages/RootPage";
import { authAction } from "../actions";
import ChannelPage, { loader as channelLoader } from "../pages/ChannelPage";
import VideoFormPage, {action as uploadOrEditAction} from "../pages/VideoFormPage";
import VideoPage, { loader as videoLoader } from '../pages/VideoPage';
import PlaylistPage from "../pages/PlaylistPage";
import SearchPage from "../pages/SearchPage";

const router = createBrowserRouter([
  { path: "/auth", element: <AuthPage />, index: true, action: authAction },
  {
    path: "/",
    element: <RootPage />,
    loader: userLoader,
    children: [
      { index: true, element: <HomePage />, loader: HomeLoader },
      {
        path: "channels/:channelId",
        element: <ChannelPage />,
        loader: channelLoader,
      },
      {
        path: 'search', element: <SearchPage />
      },
      {
        path: '/playlists/:playlistId', element: <PlaylistPage />
      },
      {
        path: 'upload', element: <VideoFormPage />, action: uploadOrEditAction
      },
      {
        path: "videos/:videoId",
        loader: videoLoader,
        id: 'video',
        children: [
          { index: true, element: <VideoPage /> },
          { path: "edit", element: <VideoFormPage />, action: uploadOrEditAction },
        ],
      },
    ],
  },
]);

export default router;
