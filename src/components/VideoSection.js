import React from 'react';

const VideoSection = () => {
  return (
    <section className="abouts-sainik vdtrails" id="tvc">
      <div className="container">
        <div className="abts-pads text-center cnts">
          <h2><span>Watch The </span> Film</h2>
        </div>
        
        <div className="row">
          <div className="col-lg-12 col-md-12 mx-auto">
            <div className="vidofrms">
              <iframe 
                className="mnfrms"  
                src="https://www.youtube.com/embed/AH48FeyriHo" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;