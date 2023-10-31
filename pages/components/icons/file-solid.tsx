export default function FileIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path d="M4,19V5c0-1.657,1.343-3,3-3h7l6,6v11c0,1.657-1.343,3-3,3H7C5.343,22,4,20.657,4,19z" opacity=".35"></path>
      <path d="M14,6V2l6,6h-4C14.895,8,14,7.105,14,6z"></path>
      <path d="M15,13H9c-0.553,0-1-0.448-1-1s0.447-1,1-1h6c0.553,0,1,0.448,1,1S15.553,13,15,13z"></path>
      <path d="M13,17H9c-0.553,0-1-0.448-1-1s0.447-1,1-1h4c0.553,0,1,0.448,1,1S13.553,17,13,17z"></path>
    </svg>
  );
}
