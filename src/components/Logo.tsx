type LogoProps = {
    logoVariant: string
}
export default function Logo({logoVariant}: LogoProps) {
  return <img src={`/logo_${logoVariant}.png`} alt="Task Manager logo" />;
}
