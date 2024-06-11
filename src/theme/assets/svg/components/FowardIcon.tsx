import * as React from "react";
import Svg, {
  SvgProps,
  Mask,
  Path,
  G,
  Defs,
  Pattern,
  Use,
  Image,
} from "react-native-svg";
const SvgComponent = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Mask
      id="b"
      width={20}
      height={20}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <Path fill="url(#a)" d="M0 0h20v20H0z" />
    </Mask>
    <G mask="url(#b)">
      <Path fill="#709C3C" d="M0 0h20v20H0z" />
    </G>
    <Defs>
      <Pattern
        id="a"
        width={1}
        height={1}
        patternContentUnits="objectBoundingBox"
      >
        <Use xlinkHref="#c" transform="scale(.00781)" />
      </Pattern>
      <Image
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsSAAALEgHS3X78AAADU0lEQVR42u2dTW9MURiAz7SN+AEisSBEiY8QX9XSEJFibSGxYGGhPlqtlUU3dmxsxM8gLC1sLP0CEiGEEOKrxaDXtOM96bmZ4+R2OnOvSM55nyd5M0ln0sU8T++dk95zxxgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgP9Nr0yfmx7eDj30lHwOEpK/XOa4zJTMFZmR4MgACcs/IvNMphnMI5kt7jV9vF1pyj/sCW/IZG4a7mefZXYRQZpYoU+caCt9PpjMPfeFCNL86z/qBM8VyJ93z/12j9Myu4kgnb98y7gn2ZfeJIL01/uWUe/cHwZABApOATsD0USgiJp7vOekzhYIXyqCPUQQfwArZZ56K4FuIpghgjROBatlnleIYIAI4v9AuEbmBRHoXhaulXlJBLojWCfzqmQEX2X2EkH8EayXeR3IJQJlEWyQeUMEuiPYKPOWCHRHsEnmXYUIBokg/gg2y7wvGcE3Ikgjgq0yHypEMEQE8UewTeYjEeiOYLvMJyLQHcEOs3CZGBEojsBeIzhdMoLvMvuIIP4I7L+CZ4hAdwQDbr1PBIojGHTndiJQHIGVWK8QwX4iiD+CYZkfJSOoE0EaERyQ+VkhgmEiiD+CgzK/iEB3BIdM61LzRoUI2JoecQR253FWIYL8knNuUhFxBCOeVD+CZpsI8mgeyyzjrYw/ArsLec60diI3F5miI8FJTgVpRHDMLNxswt+O3i6C/ChwgwDixj9/PzR/70buJICbBJCG/LvB54ClTgF5AGMsCeOXf6fLlUD+OnvNwSr3O2q8pXHLzzzB7eT7nw/OsAzUK/8y8pGPfOSDJvmTyEc+8hXJz38+gXzkIx/5oEn+JeQjH/kK5Y8jH/nIRz4gH1TIH0O+XvkXkY985CMfkA8q5F9APvKRHxG1fyT/PPLj5jby9R76r1eQfw75cR/67RdF1QOx3cpnz16E5NJOmc6/Ohb5CZFvtJw0nX15tC9/FPnpHAFOLHIEQL6SzwArTOv+/0U7d/2t3GeRn+YqYMITnznpdmaRr4erpviGDfaGj6dZ6unA3vD5lswDmfsy12T6ka/rdNDtc5BYBL3BSoHbsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAv4A3RXm3jBQwtUAAAAASUVORK5CYII="
        id="c"
        width={128}
        height={128}
      />
    </Defs>
  </Svg>
);
export default SvgComponent;
