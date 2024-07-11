import '@/assets/style/components-style.scss';

export default function ScrollBar({ height, children }) {
  return (
    <div
      className="li-scroll-bar-wrapper"
      style={{
        height,
      }}
    >
      {children}
    </div>
  );
}
