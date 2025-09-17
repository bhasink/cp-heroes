import React from 'react';

const StoryTiles = () => {
  return (
    <section className="cp_tiles">
      <div className="cp_tiles_head">
        <h2>Stories That Move</h2>
        <p>Explore how different voices are celebrating unseen strength.</p>
      </div>

      <div className="yt_tiles container">
        <div className="yt_tile">
          <img src="/images/video_placeholder.png" alt="" />
        </div>
        <div className="yt_tile">
          <img src="/images/video_placeholder.png" alt="" />
        </div>
        <div className="yt_tile">
          <img src="/images/video_placeholder.png" alt="" />
        </div>
        <div className="yt_tile">
          <img src="/images/video_placeholder.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default StoryTiles;