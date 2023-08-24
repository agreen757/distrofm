//this is a functional component to be used as the main page
import React from 'react';
import {
    ChakraProvider,
    Stack,
    Box,
    Text,
    Image,
    Center,
    AbsoluteCenter
  } from '@chakra-ui/react';
/** swiper stuff */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';


// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';
  /************************** */
export default function Home(props) {
    const { videos, playMusic } = props
    function removeOfficial(inputStr) {
      return inputStr.replace(/(\[|\()(?=.*official).*?(\]|\))/gi, '').trim();
  }
    return (
        <Box margin={'10'} >
                <Swiper
                  effect={'coverflow'}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={'3'}
                  mousewheel={true}
                  initialSlide={1}
                  navigation={true}
                  coverflowEffect={{
                    rotate: 55,
                    stretch: 0,
                    depth: 80,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  modules={[EffectCoverflow, Mousewheel, Navigation]}
                  className="mySwiper"
                  >
                  {videos.map((video) => (
                    <SwiperSlide
                      style={{textAlign: 'center'}}
                      key={video.video_id}
                      onClick={()=> playMusic(video.video_id, video.channel_display_name)}
                    >
                        <Stack textAlign={'left'}>
                          <Center>
                            <Box width={'100%'}>
                              <Image boxSize={'400px'} objectFit={'cover'} src={video.thumbnail_url} />
                            </Box>
                          </Center>
                          <Box>
                            <Text alt='channelname' textAlign={'left'} fontSize={'sm'} color="white">{video.channel_display_name}</Text>
                            <Text alt='title' color="white">{removeOfficial(video.video_title)}</Text>
                          </Box>
                        </Stack>
                   </SwiperSlide>
                  ))}
                </Swiper>
              </Box>
    )
}
