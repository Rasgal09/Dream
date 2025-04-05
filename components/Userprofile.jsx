import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
export const Userprofile = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={200}
    height={200}
    fill="none"
    {...props}
  >
    <Circle
      cx={100}
      cy={100}
      r={98}
      fill="#B1B1B1"
      stroke="#fff"
      strokeWidth={4}
    />
    <Path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={5}
      d="M142 147.25v-10.5c0-5.57-2.212-10.911-6.151-14.849A20.995 20.995 0 0 0 121 115.75H79a20.997 20.997 0 0 0-21 21v10.5M100 100.75c11.598 0 21-9.402 21-21s-9.402-21-21-21-21 9.402-21 21 9.402 21 21 21Z"
    />
  </Svg>
)
export default Userprofile
