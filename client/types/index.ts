import React from "react";

export interface FetchMultipleTypeDataType {
  email: string;
  playlistId: string;
  url: string;
}

export interface SaveChatbotDataType {
  email: string;
  playlistId: string;
  question: string;
  answer: string;
}

export interface SaveDiscussionDataType {
  playlistId: string;
  videoId: string;
  content: string;
  username: string;
  userImageUrl: string;
}

export interface LoginType {
  name: string;
  email: string;
  imageUrl: string;
}

export interface AddAndRemoveChaptersType {
  email: string;
  playlistId: string;
  videoId: string;
  url: string;
}

export interface ChapterActionType {
  isCompleted: boolean;
  email: string;
  playlistId: string;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnails: string;
  description: string;
  bookmark: boolean;
  indexOrder: number;
}

export interface CourseCardType {
  title: string;
  channelTitle: string;
  thumbnails: string;
  id: string;
  description: string;
  bookmark: boolean;
  getDataCheck: boolean;
  indexOrder: number;
  setGetDataCheck: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface chatType {
  question: string;
  answer: string | null;
}

export interface discussionType {
  name: string;
  image: string;
  content: string;
}

export interface PlaylistCardType {
  title: string;
  channelTitle: string;
  thumbnails: string;
  isChecked: boolean;
  id: string;
  videoId: string;
  currentvideoId: string;
  index: number;
}

export interface playlistType {
  id: {
    playlistId: string;
  };
  snippet: {
    title: string;
    channelId: string;
    thumbnailURL: string;
    channelTitle: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

export interface playlistType2 {
  snippet: {
    playlistId: string;
    title: string;
    channelId: string;
    thumbnailURL: string;
    channelTitle: string;
    resourceId: {
      videoId: string;
    };
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

// export interface playlistType3 {
//   id: {
//     playlistId: string;
//   };
//   snippet: {
//     title: string;
//     channelId: string;
//     thumbnailURL: string;
//     channelTitle: string;
//     description: string;
//     resourceId: {
//       videoId: string;
//     };
//     thumbnails: {
//       high: {
//         url: string;
//       };
//     };
//   };
// }
