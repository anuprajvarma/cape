import React from "react";

export interface ChapterCompletionPropType {
  id: string | string[] | undefined;
  playlistLengths: Record<string, string>;
  completedChapters: string[];
  precentage: number;
}

export interface videoTitleSection {
  id: string | string[] | undefined;
  videoTitle: string;
  videoId: string | string[] | undefined;
  playlists: playlistType2[];
  playlistLengths: Record<string, string>;
  completedChapters: string[];
  setPlaylistLengths: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

export interface ChatbotSectionPropType {
  id: string;
  temporaryChatData: chatType[];
  setTemporaryChatData: React.Dispatch<React.SetStateAction<chatType[]>>;
}

export interface QuizzSectionPropType {
  videoTitle: string;
  id: string;
  videoId: string;
  Completed: number;
  quizzcheck: boolean;
  countedScore: number;
  setCompleted: React.Dispatch<React.SetStateAction<number>>;
  setCountedScore: React.Dispatch<React.SetStateAction<number>>;
}

export interface SearchInputPropType {
  showSuggestions: boolean;
  suggestionsArray: string[];
  searchQuery: string;
  topic: string;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export interface DeleteDisussionPropType {
  playlistId: string;
  videoId: string;
  name: string;
  content: string;
}

export interface FetchPlaylistsPropType {
  max: string;
  topic: string;
}

export interface FetchDiscussionDataPropType {
  id: string;
  videoId: string;
}

export interface SortItemPropType {
  id: string;
  data: BookmarkPlaylistType;
  setGetDataCheck: React.Dispatch<React.SetStateAction<boolean>>;
  getDataCheck: boolean;
}

export interface NotesGptPropType {
  id: string;
  videoId: string;
  videoTitle: string;
}

export interface QuizzType {
  question: string;
  options: string[];
  answer: string;
}

export interface User {
  name: string;
  email: string;
  imageUrl: string;
}

export interface EnrolledCardPropType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLength: string;
  channelImage: string;
  playlistId: string;
  playlistDescription: string;
  setGetDataCheck: React.Dispatch<React.SetStateAction<boolean>>;
  getDataCheck: boolean;
}

export interface EditorPropType {
  email: string;
  playlistId: string;
}

export interface BookmarkType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLength: string;
  channelImage: string;
  playlistId: string;
  playlistDescription: string;
  bookmark: boolean;
}

export type SpeechRecognitionConstructor = new () => SpeechRecognition;

export type SpeechWindow = Window & {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export interface BookmarkPlaylistType {
  title: string;
  channelTitle: string;
  thumbnail: string;
  chapterLength: string;
  channelImage: string;
  playlistId: string;
  playlistDescription: string;
}

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

export interface EnrolledCourseType {
  title: string;
  channelTitle: string;
  thumbnails: string;
  id: string;
  description: string;
  indexOrder: number;
  email: string;
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
