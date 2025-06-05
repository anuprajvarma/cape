export interface CourseCardType {
  title: string;
  channelTitle: string;
  thumbnails: string;
  lenth: string;
  channelThumb: string;
  id: string;
  description: string;
  bookmark: boolean;
}

export interface chatType {
  question: string;
  answer: string;
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
  // lenth: number;
  // channelThumb: string;
  // setCheckBoxTrack: React.Dispatch<React.SetStateAction<boolean>>;
  // checkBoxTrack: boolean;
  isChecked: boolean;
  id: string;
  videoId: string;
  currentvideoId: string;
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
