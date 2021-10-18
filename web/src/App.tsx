import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  List,
  ListItem,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { SyntheticEvent, useRef, useState } from "react";
import Card from "./Card";

// const SERVER_URL = "http://localhost:5000";
const SERVER_URL = "https://invertedindexir.herokuapp.com";

export interface Book {
  title: string;
  author: string;
  coverImg: string;
  description: string;
  genres: string;
  price?: number;
  publisher: string;
  rating: number;
}

interface ResponseData {
  found: number;
  response: Book[] | null;
  total: number;
  suggestions?: string[];
}

function App() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [books, setBooks] = useState<ResponseData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  async function handleSearch(e: SyntheticEvent) {
    e.preventDefault();
    setBooks(undefined);
    setNotFound(false);
    if (!searchRef.current?.value) {
      searchRef.current?.focus();
      return;
    }
    try {
      const val = searchRef.current.value.split(",");
      const inputQuery = val.length == 1 ? val[0] : val;

      setLoading(true);

      const { data }: { data: ResponseData } = await axios.post(
        SERVER_URL + "/getData",
        { inputQuery }
      );
      if (data.found == 0) {
        setNotFound(true);
        if (data.suggestions) setRecommendations(data.suggestions);
      }
      if (data.response) setBooks(data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Something went wrong");
    }
  }

  function clearBooks() {
    setBooks(undefined);
    if (!searchRef.current) {
      return;
    }
    searchRef.current.value = "";
    searchRef.current.focus();
  }

  return (
    <Box mx="auto" maxW="5xl" mt="20">
      <form onSubmit={handleSearch}>
        <FormControl id="search">
          <FormLabel htmlFor="search" fontWeight="semibold" color="twitter.600">
            Search Books
          </FormLabel>
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input
              id="search"
              type="search"
              ref={searchRef}
              autoComplete="off"
              placeholder="Search query, phrase, queries"
              autoFocus
            />
            <InputRightElement width="4.5rem" mx="2">
              <Button type="submit" colorScheme="linkedin" isLoading={loading}>
                Search
              </Button>
            </InputRightElement>
          </InputGroup>

          <FormHelperText>
            For multiple queries, enter comma separated words
          </FormHelperText>
        </FormControl>
      </form>

      <Box mt="5">
        {notFound && !loading && (
          <Box display="flex" flexDir="column" alignItems="center">
            <Text fontSize="2xl">Nothing matches the query</Text>
            {recommendations.length > 0 && (
              <>
                <Text>Are You Searching for:</Text>
                <List>
                  {recommendations.map((m, i) => (
                    <ListItem
                      _hover={{
                        textDecoration: "underline",
                      }}
                      cursor="pointer"
                      onClick={() => {
                        if (!searchRef.current?.value) {
                          return;
                        }
                        searchRef.current.value = m;
                        searchRef.current.focus();
                      }}
                    >
                      {m}
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        )}
        {!books && !notFound && !loading && (
          <Center>
            <Text>Type query to get results</Text>
          </Center>
        )}

        {loading ? (
          <BookSkeleton />
        ) : (
          <Stack spacing="8">
            {books && books?.response && (
              <>
                <HStack justifyContent="space-between">
                  <Text>
                    Found - {books.found} out of {books.total} documents
                  </Text>
                  <Button onClick={clearBooks} colorScheme="red">
                    Clear
                  </Button>
                </HStack>
                {books.response.map((b, i) => (
                  <Card key={i} {...b} />
                ))}
              </>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default App;

function BookSkeleton() {
  return (
    <Box>
      <VStack spacing="8">
        {[1, 2].map((ele) => {
          return (
            <>
              <Box
                key={`EventSkeleton:${ele}`}
                p="8"
                shadow="md"
                rounded="xl"
                w="full"
                minH="200px"
              >
                <HStack alignItems="start">
                  <Box>
                    <SkeletonCircle size="20" />
                  </Box>
                  <Skeleton height="1.5em" w="30%" />
                </HStack>
                <SkeletonText pt="3" rounded="full" />
              </Box>
            </>
          );
        })}
      </VStack>
    </Box>
  );
}
