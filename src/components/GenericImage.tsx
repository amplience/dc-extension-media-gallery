import { Skeleton } from "@mui/material";
import React, { FC, useContext, useState } from "react";
import { AppContext } from "../app-context";

type Props = {
  item: any,
  zoomable?: Boolean,
  w?:number,
  aspect?:{
    w:number,
    h:number
  },
  lazy?:Boolean,
  fillWidth?:Boolean
};



const GenericImage: FC<Props> = ({ item, zoomable = false, w = 248, aspect = {w:3,h:2}, lazy = true, fillWidth = false }) => {
  const app = useContext(AppContext)
  const [imageLoading, setImageLoading] = useState(true)

  const realWidth:number = zoomable ? w * app.zoom : w;
  const realHeight:number = zoomable ? ((w / aspect.w) * aspect.h) * app.zoom : ((w / aspect.w) * aspect.h);

  const handleImageLoaded = () => {
    setImageLoading(false)
}

  return (
    <>
    
    <div style={{overflow: 'hidden'}}>
        <Skeleton variant="rectangular" width={'100%'} height={'auto'} sx={{ bgcolor: 'grey.900', display: `${imageLoading ? 'block' : 'none'}`, marginLeft: 'auto',
            marginRight: 'auto', aspectRatio: '3/2'}} >
        </Skeleton>
        <img
          src={`${item.img}?w=${realWidth}&h=${realHeight}&bg=rgb(0,0,0)&fmt=auto&qlt=60&fmt.jpeg.interlaced=true`}
          srcSet={`${item.img}?w=${realWidth * 2}&h=${realHeight * 2}&bg=rgb(0,0,0)&fmt=auto&qlt=60&fmt.jpeg.interlaced=true 2x`}
          alt={item.title}
          style={{
            transition: 'opacity 0.5s ease-out',
            opacity: `${imageLoading ? 0 : 100}`,
            position: `${imageLoading ? 'absolute' : 'relative'}`,
            maxWidth: '100%',
            maxHeight: '100%',
            width: `${fillWidth ? '100%' : 'auto'}`,
            aspectRatio: '3/2',
            cursor: "zoom-in",
            backgroundColor:'#ff00000'
          }}
          loading={lazy ? 'lazy' : 'eager'}
          title="Click to zoom"
          id={item.id}
          onClick={() => app.handleFullScreenView(item)}
          onLoad={() => handleImageLoaded()} 
        />
          
          </div>
          </>
  );
};
export default GenericImage;
