export function UserMap(user: any) {
  return {
    id: user.id,
    userId: user.data().userId,
    screenName: user.data().screenName,
    salt: user.data().salt,
    hash: user.data().hash,
    date_of_birth: user.data().date_of_birth,
  };
}

export function PostMap(post: any) {
  return {
    id: post.id,
    text: post.data().text,
    userId: post.data().userId,
    user: post.data().user,
    likes: post.data().likes,
  };
}
