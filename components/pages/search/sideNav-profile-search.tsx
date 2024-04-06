import Image from "next/image";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { CrossIcon } from "../../../icons/cross-icon";
import { UserLoginInfo } from "../../../redux/reducers/AuthReducer";
import { ProfileService } from "../../../services/ProfileServices";
import { Loader } from "../../shared/loaders/clipLoader";
import clsx from "clsx";
import { ClickAwayListener } from "@mui/material";
import { useRouter } from "next/router";

const SideNavProfileSearch = (props: any) => {
  const { isOpen, setIsOpen } = props;

  const router = useRouter();

  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<UserLoginInfo[]>([]);

  const debouncedSearchText = useDebounce(searchText.trim(), 500);

  useEffect(() => {
    if (debouncedSearchText?.length) {
      setIsLoading(true);
      ProfileService.searchProfile(debouncedSearchText)
        .then((resp) => {
          setIsLoading(false);
          setSearchResults(resp.data);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  }, [debouncedSearchText]);

  return (
    <div
      className={clsx(" text-white", {
        [" w-0"]: !isOpen,
        ["profileSearchSideNav"]: isOpen,
      })}
    >
      {isOpen ? (
        <ClickAwayListener
          onClickAway={() => {
            setIsOpen(false);
          }}
        >
          <>
            <div className="  flex flex-col ">
              <span className="text-2xl font-bold searchText my-2">Search</span>
              <div className="flex flex-row items-center profileSearchInput mx-4">
                <input
                  className="bg-transparent w-[100%] outline-none"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                ></input>
                {searchText?.length ? (
                  <div
                    className="flex items-center justify-center clearSearchIcon"
                    onClick={() => {
                      setSearchText("");
                    }}
                  >
                    <CrossIcon width={12} height={12} customColor="white" />
                  </div>
                ) : null}
              </div>
            </div>
            {!searchText?.length ? (
              <div id="recentSearchesTab" className="recentsTab">
                <div className="flex justify-between px-6 py-3">
                  <span>Recent</span>
                  <span className="clearAll">Clear all</span>
                </div>
              </div>
            ) : isLoading ? (
              <Loader />
            ) : (
              <div>
                {searchResults?.map((result) => {
                  debugger;
                  return (
                    <div
                      key={result.username}
                      className="flex items-center justify-start gap-2 px-6 py-2 cursor-pointer"
                      onClick={() => {
                        router.push(`/profile/${result.username}`);
                        setIsOpen(false);
                        setSearchText("");
                        setSearchResults([]);
                      }}
                    >
                      <Image
                        src={result.profileImg}
                        width={44}
                        height={44}
                        alt="userProfileImg"
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span>{result.username}</span>
                        <span className="text-secondary">{result.bio}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        </ClickAwayListener>
      ) : null}
    </div>
  );
};

export default SideNavProfileSearch;
