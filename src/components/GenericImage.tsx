import { Chip, CircularProgress, Skeleton, Typography } from "@mui/material";
import { style } from "@mui/system";
import React, { FC, useContext, useState } from "react";
import { AppContext } from "../app-context";
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';

type Props = {
  item: any,
  zoomable?: Boolean,
  disabled?: Boolean,
  updated?: Boolean,
  w?: number,
  aspect?: {
    w: number,
    h: number
  },
  lazy?: Boolean,
  fillWidth?: Boolean,
  loadingIcon?: Boolean,
  textCol?: string
};

const GenericImage: FC<Props> = ({
  item,
  zoomable = false,
  disabled = false,
  updated = false,
  w = 248,
  aspect = { w: 3, h: 2 },
  lazy = true,
  fillWidth = false,
  loadingIcon = false,
  textCol = 'black'
}) => {
  const app = useContext(AppContext)
  const [imageLoading, setImageLoading] = useState(true)

  const realWidth: number = zoomable ? w * app.zoom : w;
  const realHeight: number = zoomable ? ((w / aspect.w) * aspect.h) * app.zoom : ((w / aspect.w) * aspect.h);

  const handleImageLoaded = () => {
    setImageLoading(false)
  }

  return (
    <>

      <div style={{ overflow: 'hidden', color: textCol, position: 'relative' }}>
        <div style={{ width: '100%', height: 'auto', display: `${imageLoading && loadingIcon ? 'block' : 'none'}`, aspectRatio: '3/2', marginTop: '50px' }}>
          <CircularProgress style={{ margin: 'auto', display: 'flex' }} />
          <Typography variant='subtitle1' align="center" style={{ margin: 'auto', display: "block" }}>Loading image...</Typography>
        </div>
        <Skeleton variant="rectangular" animation="wave" width={'100%'} height={'auto'} sx={{
          display: `${imageLoading && !loadingIcon ? 'block' : 'none'}`, marginLeft: 'auto',
          marginRight: 'auto', aspectRatio: '3/2'
        }} >
        </Skeleton>
        <img
          src={`${item.img}?w=${realWidth}&h=${realHeight}&bg=rgb(0,0,0)&fmt=auto&qlt=60&fmt.jpeg.interlaced=true`}
          srcSet={`${item.img}?w=${realWidth * 2}&h=${realHeight * 2}&bg=rgb(0,0,0)&fmt=auto&qlt=60&fmt.jpeg.interlaced=true 2x`}
          alt={item.title}
          style={{
            transition: 'opacity 0.5s ease-out',
            opacity: `${imageLoading ? 0 : (disabled ? 0.5 : 1)}`,
            position: `${imageLoading ? 'absolute' : 'relative'}`,
            maxWidth: '100%',
            maxHeight: '100%',
            width: `${fillWidth ? '100%' : 'auto'}`,
            aspectRatio: '3/2',
            cursor: `${zoomable ? 'zoom-in' : 'auto'}`,
            backgroundColor: '#ff00000'
          }}
          loading={lazy ? 'lazy' : 'eager'}
          title={zoomable ? 'Click to zoom' : item.entry.photo.name}
          id={item.id as string}
          onClick={() => app.handleFullScreenView(item)}
          onLoad={() => handleImageLoaded()}
        />
        {
         item.updated &&
         <Chip size="small" icon={<AutorenewOutlinedIcon />} label="updated" color="warning" style={{position: 'absolute', top: 8, right: 5}} />
        //  <AutorenewOutlinedIcon color='warning' /> 
        }
      </div>
    </>
  );
};
export default GenericImage;
