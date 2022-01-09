import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Fade,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { SyntheticEvent, useCallback, useRef, useState } from "react";
import Card from "./components/Card";
import BookSkeleton from "./components/Skeleton";
import SuggestionCard from "./components/Suggestion";
import { ResponseData, Suggestion } from "./types";
import { debounce } from "./utils/debounce";
import { server } from "./utils/server";

export default function App() {
  const searchRef = useRef<HTMLInputElement>(null);

  // TODO: Convert to a store with reducers
  const [books, setBooks] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState(false);

  const [recommendations, setRecommendations] = useState<string[]>([]);

  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleSearch = useCallback(async (searchTerm: string) => {
    try {
      const val = searchTerm.split(",");
      const inputQuery = val.length == 1 ? val[0] : val;

      setLoading(true);
      setNotFound(false);
      setSuggestions([]);

      const { data } = await server.get<ResponseData>("/getBooks", {
        params: { inputQuery },
      });

      if (data.found == 0) {
        setNotFound(true);
        setRecommendations(data.suggestions ?? []);
      } else {
        setBooks(data);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Something went wrong");
    }
  }, []);

  const handleSubmit = useCallback((event: SyntheticEvent) => {
    event.preventDefault();
    if (!searchRef.current?.value) {
      searchRef.current?.focus();
      return;
    }
    handleSearch(searchRef.current.value);
    searchRef.current.blur();
  }, []);

  const handleRecommendationSearch = useCallback((recommendation: string) => {
    if (searchRef.current) {
      searchRef.current.value = recommendation;
    }

    handleSearch(recommendation);
  }, []);

  function clearBooks() {
    setBooks(() => null);
    if (!searchRef.current) return;

    searchRef.current.value = "";
    searchRef.current.focus();
  }

  const handleSearchChange = debounce(async () => {
    if (!searchRef.current) return;

    if (searchRef.current.value.length < 2) {
      setSuggestions([]);
      return;
    }

    const val = searchRef.current.value.split(",");
    const inputQuery = val.length == 1 ? val[0] : val;

    const { data } = await server.get<Suggestion[]>("/searchSuggestions", {
      params: { inputQuery },
    });
    setSuggestions(data);
  }, 300);

  return (
    <Box mx="auto" maxW="5xl" mt="20">
      <form onSubmit={handleSubmit} style={{ position: "relative" }}>
        <FormControl id="search">
          <FormLabel
            htmlFor="search"
            fontWeight="semibold"
            color="twitter.600"
            fontSize="xl"
          >
            Search Books
          </FormLabel>
          <InputGroup size="lg" position="relative">
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input
              id="search"
              ref={searchRef}
              autoComplete="off"
              placeholder="Search query, phrase or queries"
              // autoFocus
              onChange={handleSearchChange}
              onFocus={debounce(() => setFocused(true), 600)}
              onBlur={debounce(() => setFocused(false), 605)}
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

        <Fade in={focused}>
          <Box
            position="absolute"
            top="95px"
            zIndex="10"
            rounded="md"
            bg="gray.700"
            shadow="lg"
          >
            {suggestions.length > 0 ? (
              <Stack spacing={5} py="2" maxH="70vh" overflowY="auto">
                {suggestions.map((s) => (
                  <SuggestionCard
                    {...s}
                    handleClick={handleRecommendationSearch}
                  />
                ))}
              </Stack>
            ) : (
              <Center my="5" w="sm">
                <Text fontSize="lg">
                  {searchRef.current && searchRef.current?.value.length < 2
                    ? "Waiting for a query ..."
                    : "No suggestions found!"}
                </Text>
              </Center>
            )}
          </Box>
        </Fade>
      </form>

      <Box mt="5">
        {notFound && !loading && (
          <Box display="flex" flexDir="column" alignItems="center">
            <Text fontSize="2xl">Nothing matches the query</Text>
            {recommendations.length > 0 && (
              <>
                <Text fontSize="lg" mt="4">
                  Are You Searching for:
                </Text>
                <Box display="flex" flexWrap="wrap">
                  {recommendations.map((rm) => (
                    <Button
                      variant="outline"
                      size="sm"
                      m="1"
                      key={rm}
                      _hover={{ textDecoration: "underline" }}
                      cursor="pointer"
                      onClick={() => {
                        handleRecommendationSearch(rm);
                      }}
                    >
                      {rm}
                    </Button>
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}
        {!books && !notFound && !loading && (
          <Center>
            <Text fontSize="lg">Type query to get results</Text>
          </Center>
        )}

        {loading ? (
          <BookSkeleton />
        ) : (
          <Stack spacing="8" mb="4">
            {books?.response && (
              <>
                <HStack justifyContent="space-between">
                  <Text>
                    Found - {books.found} out of {books.total} documents
                  </Text>
                  <Button onClick={clearBooks} colorScheme="red">
                    Clear
                  </Button>
                </HStack>
                {books.response.map((book, i) => (
                  <Card key={i} {...book} />
                ))}
              </>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
