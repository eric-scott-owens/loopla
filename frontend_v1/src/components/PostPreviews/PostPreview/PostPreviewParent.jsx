import React, {Component} from 'react';
import Plain from 'slate-plain-serializer';

import PostPreviewCard from '../PostPreviewComponents/PostPreviewCard/PostPreviewCard';
import PostPreviewCardHeader from '../PostPreviewComponents/PostPreviewCard/PostPreviewCardHeaders/PostPreviewCardHeader';
import PostPreviewCardHeaderMobile from '../PostPreviewComponents/PostPreviewCard/PostPreviewCardHeaders/PostPreviewCardHeaderMobile';
import UserByLine from '../../UserByLine';
import TextTruncate from '../../TextTruncate';
import Place from '../../Place';
import PhotoCollection from '../../PhotoCollection';
import ContributorList from '../../ContributorList';
import configuration from '../../../configuration';


const PostPreviewParent = (props) => {
  const { post } = props;
  if (post)
  {
    if (post.photoCollections[0].photoCollectionPhotos.length > 0)
    {
      post.photoCollections[0].photoCollectionPhotos = [post.photoCollections[0].photoCollectionPhotos[0]]
    }
  }

  return(
    <React.Fragment>
      <PostPreviewCard className="o-desktop-post-preview-card">
        <PostPreviewCardHeader post={post}/>
        
        <UserByLine for={post} dontShowLoop dontLinkToProfile/>
        
        <div 
        className={`o-truncate-text`}>
          <TextTruncate 
            line={12} 
            truncateText="..."
            text={configuration.enableRichTextEditing ? Plain.serialize(post.text) : post.text}
            textTruncateChild={<div className="o-truncate-text-helper">read more&nbsp;&#10140;&nbsp;</div>}
            />
            {/* <TextTruncate text={configuration.enableRichTextEditing ? Plain.serialize(post.text) : post.text} /> */}
        </div>
        
        {post.places.map(placeId => (
          <div className="o-place-area" key={placeId}>
            <Place id={placeId} noMap noAddress noPhone noWebsite/>
          </div>
        ))}

        {post.photoCollections.map(photoCollection => (
          <PhotoCollection value={photoCollection} key={photoCollection.id}/>
        ))}


        {post.comments.length >= 1 && 
            <div className="">
              <ContributorList dontLinkToProfile for={post} />
            </div>
        }
        <div className="o-post-preview-cta">
          <span className="o-post-preview-cta-text">show more</span>
        </div>
        {/* <Kudos for={post} disabled /> */}
      </PostPreviewCard>
      <PostPreviewCard className="o-mobile-post-preview-card">
          <PostPreviewCardHeaderMobile post={post}/>
          
          <UserByLine for={post} dontShowLoop dontLinkToProfile/>
          <div className="o-post-preview-body">
            <div className={`o-truncate-text ${post.photoCollections[0].photoCollectionPhotos.length === 0 ? 
          'o-empty-truncate-text' : ''}`}>
              <TextTruncate 
                line={12} 
                truncateText="..."
                text={configuration.enableRichTextEditing ? Plain.serialize(post.text) : post.text}
                textTruncateChild={<div className="o-truncate-text-helper">read more&nbsp;&#10140;&nbsp;</div>}
                />
                {/* <TextTruncate text={configuration.enableRichTextEditing ? Plain.serialize(post.text) : post.text} /> */}
            </div>
            
            {/* {post.places.map(placeId => (
              <div className="o-place-area" key={placeId}>
                <Place id={placeId} noMap noAddress noPhone noWebsite/>
              </div>
            ))} */}
            {post.photoCollections.map(photoCollection => (
              <PhotoCollection parentClassName="o-post-preview-mobile-photos" galleryClassName="o-post-preview-mobile-gallery" value={photoCollection} key={photoCollection.id}/>
            ))}
          </div>
          {post.comments.length >= 1 && 
              <div>
                <ContributorList for={post} className="o-contributor-list-float-right" dontDisplayAvatar dontLinkToProfile/>
              </div>
          }
          <div className="o-post-preview-cta">
            <span className="o-post-preview-cta-text">show more</span>
          </div>
          {/* <Kudos for={post} disabled /> */}
        </PostPreviewCard>
    </React.Fragment>
  );
}

export default PostPreviewParent;