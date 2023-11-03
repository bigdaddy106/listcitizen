import { AvatarComponent } from "@rainbow-me/rainbowkit";

const EnsAvatar: AvatarComponent = ({ ensImage, size }) => {
  return ensImage ? (
    <img
      src={ensImage}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
      alt="EnsAvatar"
    />
  ) : (
    <img
      src="/images/avatar.png"
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
      alt="EnsAvatar"
    />
  );
};

export default EnsAvatar;
