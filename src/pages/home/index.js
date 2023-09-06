//this is a functional component to be used as the main page
import React from 'react';
import {
  ChakraProvider,
  Stack,
  Box,
  Text,
  Image,
  Center,
  AbsoluteCenter,
} from '@chakra-ui/react';
/** swiper stuff */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
// import required swiper modules
import { EffectCoverflow } from 'swiper/modules';
/************************** */
/**
 * Loading anim
 */
import { Waveform } from '@uiball/loaders';
export default function Home(props) {
  const { videos, playMusic, setSwiper, windowSize, playing, controlState } = props;
  function removeOfficial(inputStr) {
    return inputStr.replace(/(\[|\()(?=.*official).*?(\]|\))/gi, '').trim();
  }
  return (
    <Center>
      <Box hidden={videos.length > 0 ? true : false} width={'100%'} pt={200}>
        <Center>
          <Waveform size={100} lineWeight={3.5} speed={1} color="white" />
        </Center>
      </Box>
      <Swiper
        onSwiper={setSwiper}
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        mousewheel={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            mousewheel: false,
            navigation: false,
          },
          768: {
            slidesPerView: 2,
            navigation: false,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        initialSlide={1}
        navigation={windowSize === 'small' ? false : true}
        coverflowEffect={{
          rotate: 55,
          stretch: 10,
          depth: 80,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[EffectCoverflow, Mousewheel, Navigation]}
        className="mySwiper"
      >
        {videos.map(video => (
          <SwiperSlide
            key={video.video_id}
            onClick={() =>
              playMusic(video.video_id, video.channel_display_name)
            }
          >
            <Center width={'100%'}>
              <Stack
                textAlign={
                  windowSize === 'small' || windowSize === 'medium'
                    ? 'center'
                    : 'left'
                }
                paddingLeft={{ base: '200px', md: '0px', lg: '0px' }}
              >
                <Box pos={'relative'} width={{ base: '500px', md: '100%', lg: '100%' }}>
                  <Box opacity={'.5'} pos={'absolute'} top={windowSize === 'small' ? '10px':'70px'}
                      left={windowSize === 'small' ? '60px': '150px'}>
                    <Image 
                      hidden={playing && !controlState ? true:false}
                      w={{ base: '180px', md: '250px', lg: '220px' }}
                      src={'play-button.svg'} />
                  </Box>
                  <Image
                    w={{ base: '300px', md: '250px', lg: '520px' }}
                    h={{ base: '200px', md: '250px', lg: '350px' }}
                    src={video.thumbnail_url}
                  />
                </Box>
                <Box width={{ base: '300px', md: '300px', lg: '100%' }}>
                  <Text alt="channelname" fontSize={'sm'} color="white">
                    {video.channel_display_name}
                  </Text>
                  <Stack direction={'row'} spacing={2}>
                    {video.genre.map(genre => (
                      <Box hidden={windowSize === 'small' ? true : false}>
                        <Text
                          key={genre}
                          padding={'5px'}
                          border={'1px solid white'}
                          borderRadius={'10'}
                          alt="channelgenre"
                          fontSize={'.5em'}
                          color="white"
                        >
                          {genre}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                  <Text alt="title" color="white">
                    {removeOfficial(video.video_title)}
                  </Text>
                </Box>
              </Stack>
            </Center>
          </SwiperSlide>
        ))}
      </Swiper>
    </Center>
  );
}
