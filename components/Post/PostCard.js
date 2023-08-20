import Image from 'next/image'
import React from 'react'

const PostCard = ({ post, selectPost }) => {
  return (
      <div
          onClick={() => selectPost(post)}
          className="justify-center mb-2 bg-gray-100 p-2 w-full block cursor-pointer"
          key={post._id}
      >
            <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/image/${post?.content[0]?.image?.thumbnail?.private_id}`}
                height={400}
                width={400}
                objectFit="cover"
            />
          {/* <button key={post._id} onClick={() => selectPost(post)}>
          </button> */}
          <h2 className="font-bold">{post?.user?.name}</h2>
          <h2 className="font-bold">{post?.place?.name}</h2>
          <h2>
              Status:{" "}
              <span className={`${post?.status == "active" && "font-bold text-red-600"}`}>
                  {post?.status.charAt(0).toUpperCase()}{post?.status.slice(1)}
              </span>
          </h2>
          <h2 className="flex justify-start items-center">
              Recommend:{" "}
              <span
                  className={`ml-1 ${post?.recommend
                      ? "font-bold text-red-600"
                      : ""
                      }`}
              >
                  {post?.recommend ? " True" : " False"}
              </span>
          </h2>
          <h2 className="flex justify-start items-center">
              Coordinates:{" "}
              <span
                  className={`ml-1 ${post?.coordinate_status
                      ? "font-bold text-red-600"
                      : ""
                      }`}
              >
                  {post?.coordinate_status ? " True" : " False"}
              </span>
          </h2>

          <h2 className="flex justify-start items-center">
              Verified Coordinates:{" "}
              <span
                  className={`ml-1 ${post?.verified_coordinates
                      ? "font-bold text-red-600"
                      : ""
                      }`}
              >
                  {post?.verified_coordinates ? " True" : " False"}
              </span>
          </h2>

          <h2 className="flex justify-start items-center">
              Manual Coordinates:{" "}
              <span
                  className={`ml-1 ${post?.manual_coordinates
                      ? "font-bold text-red-600"
                      : ""
                      }`}
              >
                  {post?.manual_coordinates ? " True" : " False"}
              </span>
          </h2>

      </div>
  )
}

export default PostCard