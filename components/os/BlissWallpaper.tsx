export default function BlissWallpaper() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/wallpaper.jpg"
      alt=""
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      draggable={false}
    />
  )
}
