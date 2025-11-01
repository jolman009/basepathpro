export const mockStore: {
  videos: any[];
  athletes: any[];
  addVideo: (video: any) => void;
} = {
  videos: [],
  athletes: [],
  addVideo(video: any) {
    this.videos.push(video);
  },
};
