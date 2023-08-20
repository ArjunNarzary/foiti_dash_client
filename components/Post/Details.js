import React from 'react'
import Image from 'next/image';

const Details = ({ post }) => {
  return (
      <div>
          <div className='float-left'>
              {post.name != "" && post.name != undefined && (
                  <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${post?.content[0]?.image?.large?.private_id}`}
                      width={650}
                      height={650}
                      objectFit="contain"
                  />
              )}
          </div>
          <div>
              <h2>Viewers: {post?.viewers.length}</h2>
              <h2>Likes: {post?.like.length}</h2>
              <h2>Location Clicked: {post?.location_viewers?.length}</h2>
              <h2>Status: {post?.status}</h2>
              <h2>Uploaded on: {post?.createdAt}</h2>
              <h2>Last Updated on: {post?.updatedAt}</h2>
          </div>

          <div className='mt-4'>
              <h2>User: <span className='font-bold'>{post?.user?.name}</span></h2>
              <h2>Location: <span className='font-bold'>{post?.place?.name}</span></h2>
              <div>
                  <h2>Address: (Google)</h2>
                  {post?.place?.name != "" && post?.place?.name != undefined && (
                      <div className="pl-4">
                          {Object.keys(post?.place?.address).map((key, index) => {
                              return (
                                  <p key={index}>
                                      <span>{key}</span> :{" "}
                                      {post?.place?.address[key]}
                                  </p>
                              );
                          })}
                      </div>
                  )}
              </div>
              <h2>Caption: <span>{post?.caption}</span></h2>
          </div>
      </div>
  )
}

export default Details