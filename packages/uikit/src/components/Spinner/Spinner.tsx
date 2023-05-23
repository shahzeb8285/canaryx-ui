import React from "react";
import {  Box, } from "@pancakeswap/uikit";
import { SpinnerProps } from "./types";
import { LoadingDot } from "../../widgets/Liquidity";

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Box width={size}  position="relative">
      {/* <Image
        width={size}
        height={size * 1.197}
        src="https://assets.pancakeswap.finance/web/pancake-3d-spinner-v2.gif"
        alt="pancake-3d-spinner"
      /> */}
      {/* <LoadingDot/> */}
    </Box>
  );
};

export default Spinner;
