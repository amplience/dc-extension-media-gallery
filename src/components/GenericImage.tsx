import { CircularProgress, Skeleton, Typography } from "@mui/material";
import { style } from "@mui/system";
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
  fillWidth?:Boolean,
  loadingIcon?:Boolean,
  textCol?:string
};



const GenericImage: FC<Props> = ({ item, zoomable = false, w = 248, aspect = {w:3,h:2}, lazy = true, fillWidth = false, loadingIcon = false, textCol = 'black' }) => {
  const app = useContext(AppContext)
  const [imageLoading, setImageLoading] = useState(true)

  const realWidth:number = zoomable ? w * app.zoom : w;
  const realHeight:number = zoomable ? ((w / aspect.w) * aspect.h) * app.zoom : ((w / aspect.w) * aspect.h);

  const handleImageLoaded = () => {
    setImageLoading(false)
}

  return (
    <>
    
    <div style={{overflow: 'hidden', color:textCol}}>
        <div style={{width: '100%', height:'auto', display: `${imageLoading && loadingIcon ? 'block' : 'none'}`, aspectRatio: '3/2', marginTop: '50px'}}>
          <CircularProgress style={{margin: 'auto', display: 'flex'}}/>
          <Typography variant='subtitle1' align="center" style={{margin: 'auto', display:"block"}}>Loading image...</Typography>
        </div>
        <Skeleton variant="rectangular" animation="wave" width={'100%'} height={'auto'} sx={{ display: `${imageLoading && !loadingIcon ? 'block' : 'none'}`, marginLeft: 'auto',
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
