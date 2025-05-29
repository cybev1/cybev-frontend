
export async function mintPost(postId, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/mint`, {
    method: 'POST',
    headers: { Authorization: token }
  });
  return await res.json();
}

export async function boostPost(postId, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/boost`, {
    method: 'POST',
    headers: { Authorization: token }
  });
  return await res.json();
}

export async function pinPost(postId, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/pin`, {
    method: 'POST',
    headers: { Authorization: token }
  });
  return await res.json();
}

export async function schedulePost(postId, datetime, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/schedule`, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ datetime })
  });
  return await res.json();
}

export async function sharePost(postId, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts/${postId}/share`, {
    method: 'POST',
    headers: { Authorization: token }
  });
  return await res.json();
}
