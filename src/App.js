//add pagination, search, genre filter, channel image in player
//https://swiperjs.com/demos#navigation
//patSf4WSE6sxFaJ3p.dc7e9c85d55db18effb7eb3a465952a05fa75e8829b28a935d1e8ec0afcba862
import {React} from 'react';
import { BrowserRouter, Router, Route, Routes, Link as RouteLink } from 'react-router-dom';
import { BrowserHistory } from 'react-router';
import * as ReactDOM from 'react-dom';
import { useEffect,useState } from 'react';
import YouTube from 'react-youtube';
import { FaPlay, FaPause } from "react-icons/fa";
import {
  ChakraProvider,
  Box,
  Text,
  Menu,
  MenuList,
  MenuButton,
  HStack,
  extendTheme,
  MenuItem,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Home from './pages/home/index.js';
import Blog from './pages/blog/index.js';

//import App.css
import './App.css';
function App() {

  const AirTable = require('airtable');
  //const base = new AirTable({apiKey: "patSf4WSE6sxFaJ3p.dc7e9c85d55db18effb7eb3a465952a05fa75e8829b28a935d1e8ec0afcba862"}).base('appBMUgkz5z61UvgZ')
  const base = new AirTable({apiKey: "patHbwcfkRmGgm0cj.05eb09cd5198428158e0ce5711eabd38d7f139eadb10bc57168a3eba6ee70e8c"}).base('appBMUgkz5z61UvgZ')
  const [genres, setGenres] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const pause = document.getElementById('pause');
  const play = document.getElementById('play');
  // make variable for element with id playerbar span
  let playerbar = document.querySelectorAll('#playerbar span')[0];

  const theme = extendTheme({
    styles: {
      global: (props) => ({
        body: {
          bg: 'black'
        }
      })
    },
  })

  

  const fontSizes = { base: '20px', md: '16px', lg: '20px' }

  const pauseMusic = () => {
    console.log('pausing music')
    playing.pauseVideo()
    //remove animation css attribute from playerbar
    playerbar.style.animation = 'none'
    playerbar.style.paddingLeft = '0'
    
    pause.setAttribute('hidden','')
    play.removeAttribute('hidden')
  }
  const resumeMusic = () => {
    console.log('resuming music')
    playing.playVideo()
    play.setAttribute('hidden','')
    pause.removeAttribute('hidden')

    playerbar.style.animation = 'marquee 15s linear infinite'
    
  }
  const playMusic = (videoId, channel_name) => {

    if (playing) {
      //make pause button visible
      pause.removeAttribute('hidden')
      play.setAttribute('hidden','')
    }

    console.log('playing music',videoId)
    //create a hidden component that plays the music

  
    //create a youtube player
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
      // https://developers.google.com/youtube/player_parameters
       autoplay: 1,
     },
   };
   const onReady = (event) => {
  //   // access to player in all event handlers via event.target
    console.log(event)
    event.target.channel_name = channel_name
    event.target.playVideo();
    setPlaying(event.target)
    //update the id="controls" div to remove hidden attribute
    const controls = document.getElementById('controls')
    controls.removeAttribute('hidden')

   }
   const onStateChange = (event) => {
     console.log('state changed',event)
   }
   const onError = (event) => {
     console.log('error',event)
   }

   const player = <YouTube videoId={videoId} opts={opts} onReady={onReady} onStateChange={onStateChange} onError={onError} /> 
   //add the player to the dom
    const container = document.getElementById('player')
    const root = ReactDOM.createRoot(container);
    root.render(player)
  
     
  }
  function removeOfficial(inputStr) {
    return inputStr.replace(/\((?=.*official).*?\)/gi, '').trim();
}
  //use effect hook to fetch data from localhost:3001
  useEffect(() => {
    if (loading) {
      fetch('//lnvnwebapi-env.eba-megqxx86.us-east-1.elasticbeanstalk.com/genres')
        .then((res) => res.json())
        .then((data) => {
          //filter blank genres
          data = data.filter((genre) => genre !== '');
          //trim whitespace from the data
          data = data.map((genre) => genre.trim());
          //remove duplicates from the data
          data = data.filter((genre, index, self) => self.indexOf(genre) === index);
          //sort alphabetically
          data.sort();
          setGenres(data);
      });
      fetch('//lnvnwebapi-env.eba-megqxx86.us-east-1.elasticbeanstalk.com/newvideos')
        .then((res) => res.json())
        .then((data) => {
          
          //remove duplicates from the data based on the video_id
          data = data.filter((video, index, self) =>
            index === self.findIndex((t) => t.video_id === video.video_id)
          );
          //remove items from data without a thumbnail_image property
          data = data.filter((video) => !video.thumbnail_image === false);
          //remove items from data without an approved property
          data = data.filter((video) => !video.approved === false || video.approved === false);
          //sort by time_published
          data.sort((a, b) => {
            return new Date(b.time_published) - new Date(a.time_published);
          });
          //edit the data to remove the {channel_display_name} - {video_title} format
          data = data.map((video) => {
            //check if video_title contains channel_display_name
            if (video.video_title.toLowerCase().includes(video.channel_display_name.toLowerCase())) {
              //remove channel_display_name (case insensitive) from video_title with any - or : characters
              //check if video_title contains the & symbol
              if (video.video_title.includes('&')) {
                return video;
              }

              video.video_title = video.video_title.replace(new RegExp(video.channel_display_name, 'i'), '').replace(/[-:]/g, '').trim();
            }
            return video;
          });
          console.log(data)
          setVideos(data);
        });
        //use the AirTable API to fetch the data
        let table = base('Table 1')
        let duplicates = []
        // remove duplicates from the airtable table
        async function removeDuplicates(table) {
          // You can await here
          const records = await table.select().all();
          //store the duplicates in a variable
          
          //filter the records to find the duplicates
          let filteredRecords = records.filter((record, index) => {
            //check if the record is a duplicate
            if (records.findIndex((t) => t._rawJson.fields['Result url'] === record._rawJson.fields['Result url']) !== index) {
              //add the duplicate to the duplicates array
              duplicates.push(record)
              //return false to remove the duplicate from the filtered records
              return false
            }
            //return true to keep the record in the filtered records
            return true
          })
          //return the filtered records
          return filteredRecords
        }
        //update the table with the filtered records
        removeDuplicates(table).then((records) => {
          //remove the duplicate records from the airtable table waiting 500ms between each update
          console.log(records.length)
          duplicates.forEach((record, index) => {
            setTimeout(() => {
              table.destroy(record.id);
              console.log('deleting record',record.id)
            }, index * 500)
          })
        })



        //get all the records from the table
        async function getTable(table) {
          // You can await here - get every record in the table
          const records = await table.select().all();
          return records.filter((record) => {
            if (record._rawJson.fields.Approved === true)
              return {
                fields: record._rawJson.fields
              }
          });
        }
        //update the blogPosts state with the data from the table
        getTable(table).then((records) => {
          console.log('records',records)
          setBlogPosts(records)
        })

        
        

      }
    
      console.log('setting loading to false')
      setLoading(false);
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl" h={'95vh'}>
        <Box margin={10} marginBottom={20}>
          <Box margin={3}>
            <Text fontFamily='Tungsten' fontWeight={500} color='#e7d0ba' fontSize='4xl'>DISTRO NATION FM</Text>
          </Box>
          <HStack spacing="24px" fontFamily='Tungsten'>
              <Box w='240px'>
                <RouteLink to="/">
                  <Text fontSize={fontSizes}>Home</Text>
                </RouteLink>
              </Box>
              <Box w='240px'>
                <Menu isLazy>
                  <MenuButton>
                    <Text fontSize={fontSizes}>Genres</Text>
                  </MenuButton>
                  <MenuList bg='black' as='ul' zIndex={2} h={'300px'} overflow={'scroll'}>
                  {genres.map((genre) => (
                    <MenuItem _hover={{ bg: '#C2C2C2' }} as='li' bg='black' key={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                  </MenuList>
                </Menu>
              </Box>
              <Box w='240px'>
                <RouteLink to="#"><Text fontSize={fontSizes}>New Releases</Text></RouteLink>
              </Box>
              <Box w='240px'>
                <RouteLink to="#"><Text fontSize={fontSizes}>Featured Music</Text></RouteLink>
              </Box>
              <Box w='240px'>
                <RouteLink to="/blog"><Text fontSize={fontSizes}>Blog</Text></RouteLink>
              </Box>
              <Box w='240px' color='black' bg='#ECEAE4'>
                <RouteLink to="#"><Text fontSize={fontSizes}>Submit your music</Text></RouteLink>
              </Box>
          </HStack>
        </Box>
        {/* Create a router that does not refresh the page when navigating to different pages */}
       
        <Routes>
          <Route exact path="/blog" element={<Blog posts={blogPosts} />} />
          <Route exact path="/" element={<Home videos={videos} playMusic={playMusic} />} />
        </Routes>
        <Box hidden id='controls' pos='fixed' bottom='0' left='0' w='100%' h='60px' bg='black' color='white'>
          <HStack align={'center'} spacing='14px' marginTop={'10px'} w='100%' h='100px'>
            <Box w='400px' h='100px' bg='black' color='white'></Box>
            <Box id="pp" w='100px' h='100px' bg='black' color='white' marginTop={'8px'} fontSize={'1.5em'}>
              <FaPause id="pause" onClick={pauseMusic} />
              <FaPlay hidden id="play" onClick={resumeMusic} />
            </Box>
            <Box w='500px' h='100px' bg='black' color='white'><p id='playerbar' className='marquee'><span>{playing.videoTitle}</span></p></Box>
            <Box w='300px' h='100px' bg='black' color='white'><Text>{playing.channel_name}</Text></Box>
          </HStack>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
