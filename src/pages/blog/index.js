//this is a functional component to be used as the main page
import React from 'react';
import {
  Stack,
  Box,
  Text,
  Center,
  SimpleGrid,
  Image,
  Link,
  AspectRatio,
} from '@chakra-ui/react';
export default function Home(props) {
  const { posts } = props;
  const fontSizes = { base: '20px', md: '16px', lg: '40px' };
  const fontSizes_2 = { base: '14px', md: '16px', lg: '20px' };
  //sort posts by date string
  posts.sort((a, b) =>
    a.fields['Result created at'] > b.fields['Result created at'] ? -1 : 1
  );
  return (
    <Box key={new Date()} margin={20}>
      <SimpleGrid
        columns={[1, 1, 3]}
        spacingX={['5px', '10px', '40px']}
        spacingY={['0px', '0px', '150px']}
      >
        {posts.map(post => (
          <>
            {/* if post.fields['Result type'] is 'blog' */}
            {post.fields['Result type'] === 'blog' ? (
              <>
                <Box key={post.id} height={['220px', '220px', '300px']}>
                  <Center color="white">
                    <AspectRatio maxW="600px" ratio={3 / 1}>
                      <Image
                        paddingTop="60px"
                        class="aspect"
                        alt={post.fields['Result image'][0].thumbnails.full.url}
                        objectFit="cover"
                        src={post.fields['Result image'][0].thumbnails.full.url}
                      />
                    </AspectRatio>
                    <Text
                      display={['none', 'none', 'none']}
                      fontSize="md"
                      color="white"
                    >
                      {new Date(
                        post.fields['Result created at']
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>

                    {/* create div that is the same size as the image with red background color that is positioned behind the image offset by 10px */}
                    <Box
                      pos="absolute"
                      zIndex="900"
                      display={'none'}
                      left="0px"
                      top="50px"
                      w="90%"
                      h={['120px', '150px', '240px']}
                      bg="#731F1F"
                    >
                      {/* insert website name by parsing the url at {post.fields['Result url']} */}
                      <Text
                        opacity="1"
                        zIndex="1001"
                        pos="absolute"
                        bottom="0px"
                        left="10px"
                        fontSize="md"
                        color="white"
                      >
                        {post.fields['Result url'].split('/')[2]}
                      </Text>
                    </Box>
                  </Center>
                </Box>
                <Center
                  color={'white'}
                  fontSize={fontSizes}
                  display={['flex', 'flex', 'flex']}
                  height={['150px', '150px', '300px']}
                >
                  <Text fontSize={fontSizes} color="white">
                    {post.fields['Result items title']}
                  </Text>
                </Center>
                <Center color="white" h={['250px', '250px', '250px']}>
                  <Stack>
                    <Box display={['none', 'flex', 'flex']}>
                      <Text
                        noOfLines={[4, 4, 4]}
                        fontSize={fontSizes_2}
                        color="white"
                      >
                        {' '}
                        {post.fields['Result items blurb']}
                      </Text>
                    </Box>
                    <Box
                      mt={[-40, 0, '20px']}
                      display={['inline', 'block', 'inline']}
                    >
                      {/* create link in new tab */}
                      <Link
                        isExternal
                        href={post.fields['Result url']}
                        color="white"
                      >
                        <Text as="u" fontSize={fontSizes_2} color="white">
                          Read More
                        </Text>
                      </Link>
                    </Box>
                  </Stack>
                </Center>
              </>
            ) : null}
            {/* if post.fields['Result type'] is 'reddit' */}
            {post.fields['Result type'] === 'reddit' ? (
              <>
                <Box key={post.id} height={['220px', '220px', '300px']}>
                  <Center
                    pos="relative"
                    color="white"
                    style={{ height: '100%' }}
                  >
                    <Box>
                      <Image
                        left="0px"
                        top="0px"
                        pos="absolute"
                        zIndex="1000"
                        maxH="240px"
                        src="reddit-logo-2436.svg"
                      />
                    </Box>
                    <Box
                      pos="absolute"
                      display="none"
                      zIndex="900"
                      left="0px"
                      top="40px"
                      w="90%"
                      h="240px"
                      bg="#731F1F"
                    >
                      {/* insert website name by parsing the url at {post.fields['Result url']} */}
                      <Text
                        opacity="1"
                        zIndex="1001"
                        pos="absolute"
                        bottom="0px"
                        left="10px"
                        fontSize="md"
                        color="white"
                      >
                        {' '}
                        /r/{post.fields['Result url'].split('/')[4]}
                      </Text>
                    </Box>
                  </Center>
                </Box>
                <Box height="300px" display={['none', 'block', 'block']}>
                  <Center color="white" style={{ height: '100%' }}>
                    <Text fontSize="5xl" color="white">
                      {post.fields['Result items title']}
                    </Text>
                  </Center>
                </Box>
                <Box height="300px">
                  <Box display={['none', 'block', 'block']}>
                    {/* show post.fields['Result created at'] which has format 2023-07-13T18:55:26.238Z in the format of January 5, 2004 */}
                    <Text fontSize="md" color="white">
                      {new Date(
                        post.fields['Result created at']
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </Box>
                  <Center color="white" style={{ height: '100%' }}>
                    <Stack>
                      <Box>
                        {/* add blurb text but limit it to 80 words if the post is over 80 words then add ... to the end of the text*/}
                        <Text
                          noOfLines={[4, 4, 4]}
                          fontSize={fontSizes_2}
                          color="white"
                        >
                          {' '}
                          {post.fields['Result items blurb']
                            .split(' ')
                            .slice(0, 50)
                            .join(' ')}
                          ..
                        </Text>
                      </Box>
                      <Box mt={4}>
                        {/* create link in new tab */}
                        <Link
                          isExternal
                          href={post.fields['Result url']}
                          color="white"
                        >
                          <Text fontSize={fontSizes_2}>Read more</Text>
                        </Link>
                      </Box>
                    </Stack>
                  </Center>
                </Box>
              </>
            ) : null}
          </>
        ))}
      </SimpleGrid>
    </Box>
  );
}
