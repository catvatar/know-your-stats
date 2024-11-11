import React, { useState, useEffect, useRef } from "react";
import Stopwatch from "./Stopwatch";
import HowToUse from "./HowToUse";
import PopupWrapper from "../utils/components/PopupWrapper";

import {
  fetchStopwatches,
  createStopwatch,
  renameStopwatch,
  deleteStopwatch,
} from "../utils/apis/stopwatches_api";
import {
  StopwatchPrototype,
  Stopwatch as StopwatchResponse,
} from "../utils/apis/types_api";
import Button from "../utils/components/Button";
import HorizontalFlexWrapper from "../utils/components/HorizontalFlexWrapper";
import H3 from "../utils/components/H3";
import Input from "../utils/components/Input";
import H2 from "../utils/components/H2";

export default function Stopwatches(): React.JSX.Element {
  const [stopwatches, setStopwatches] = React.useState<StopwatchResponse[]>([]);

  const [isAddStopwatchPopupOpen, setIsAddStopwatchPopupOpen] = useState(false);
  const [newStopwatchProtorype, setNewStopwatchProtorype] =
    useState<StopwatchPrototype | null>(null);

  const [isRenameStopwatchPopupOpen, setIsRenameStopwatchPopupOpen] =
    useState(false);
  const [stopwatchToBeRenamed, setstopwatchToBeRenamed] = useState<
    number | null
  >(null);
  const [renameStopwatchName, setRenameStopwatchName] = useState("");

  const [stopwatchToBeDeleted, setstopwatchToBeDeleted] = useState<
    number | null
  >(null);
  const [isAreYouSurePopupOpen, setIsAreYouSurePopupOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const addStopwatchInputRef = useRef<HTMLInputElement>(null);
  const renameStopwatchInputRef = useRef<HTMLInputElement>(null);

  const handleFetchStopwatches = () => {
    fetchStopwatches()
      .catch((err) => {
        setError(err);
      })
      .then((stopwatches) => {
        stopwatches && setStopwatches(stopwatches);
      });
  };

  useEffect(() => {
    handleFetchStopwatches();
  }, []);

  const handleAddStopwatch = () => {
    newStopwatchProtorype &&
      createStopwatch(newStopwatchProtorype)
        .then(() => {
          handleFetchStopwatches();
          setIsAddStopwatchPopupOpen(false);
          setNewStopwatchProtorype(null);
        })
        .catch((err) => {
          setError(err);
        });
  };

  const handleRenameStopwatch = (id: number, name: string) => {
    renameStopwatch(id, name)
      .then(() => {
        handleFetchStopwatches();
        setIsRenameStopwatchPopupOpen(false);
        setRenameStopwatchName("");
      })
      .catch((err) => {
        setError(err);
      });
  };

  const handleDeleteStopwatch = (id: number) => {
    deleteStopwatch(id)
      .then(() => {
        handleFetchStopwatches();
        setIsAreYouSurePopupOpen(false);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <>
      <HorizontalFlexWrapper className="justify-between rounded-t bg-gray-800 p-4">
        <H2>
          <a href="/">Stopwatches</a>
        </H2>
        <Button onClick={() => setIsAddStopwatchPopupOpen(true)} type="submit">
          Add Stopwatch
        </Button>
      </HorizontalFlexWrapper>
      <ul className="space-y-4 pt-4">
        {stopwatches.length > 0 ? (
          stopwatches.map((stopwatch) => (
            <li key={stopwatch.id} className="rounded bg-gray-800 p-4">
              <HorizontalFlexWrapper className="justify-between">
                <div className="group">
                  <H3>{stopwatch.name}</H3>
                  <span className="hidden text-sm text-gray-400 group-hover:block">
                    {stopwatch.description}
                  </span>
                </div>
                <HorizontalFlexWrapper className="gap-2">
                  <Button
                    onClick={() => {
                      setstopwatchToBeRenamed(stopwatch.id);
                      setIsRenameStopwatchPopupOpen(true);
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    onClick={() => {
                      setstopwatchToBeDeleted(stopwatch.id);
                      setIsAreYouSurePopupOpen(true);
                    }}
                    type="reset"
                  >
                    Delete
                  </Button>
                </HorizontalFlexWrapper>
              </HorizontalFlexWrapper>
              <Stopwatch id={stopwatch.id} />
            </li>
          ))
        ) : error ? (
          <h3>{error.toString()}</h3>
        ) : (
          <HowToUse />
        )}
      </ul>
      <PopupWrapper
        isOpen={isAddStopwatchPopupOpen}
        focusRef={addStopwatchInputRef}
        className="gap-4"
      >
        <H3>Add New Stopwatch</H3>
        <Input
          ref={addStopwatchInputRef}
          value={newStopwatchProtorype?.name || ""}
          onChange={(e) =>
            setNewStopwatchProtorype({
              name: e.target.value,
            } as StopwatchPrototype)
          }
          placeholder="Stopwatch Name"
        />
        <Input
          value={newStopwatchProtorype?.description || ""}
          onChange={(e) =>
            setNewStopwatchProtorype({
              ...newStopwatchProtorype,
              description: e.target.value,
            } as StopwatchPrototype)
          }
          placeholder="Stopwatch Description"
        />
        <HorizontalFlexWrapper className="gap-2">
          <Button
            onClick={() => setIsAddStopwatchPopupOpen(false)}
            type="reset"
          >
            Cancel
          </Button>
          <Button onClick={handleAddStopwatch} type="submit">
            Add
          </Button>
        </HorizontalFlexWrapper>
      </PopupWrapper>
      <PopupWrapper
        isOpen={isRenameStopwatchPopupOpen}
        focusRef={renameStopwatchInputRef}
      >
        <H3>Rename Stopwatch</H3>
        <Input
          ref={renameStopwatchInputRef}
          value={renameStopwatchName}
          onChange={(e) => setRenameStopwatchName(e.target.value)}
          placeholder="New Stopwatch Name"
        />
        <HorizontalFlexWrapper className="gap-2">
          <Button
            onClick={() => setIsRenameStopwatchPopupOpen(false)}
            type="reset"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              stopwatchToBeRenamed &&
                handleRenameStopwatch(
                  stopwatchToBeRenamed,
                  renameStopwatchName,
                );
            }}
            type="submit"
          >
            Submit
          </Button>
        </HorizontalFlexWrapper>
      </PopupWrapper>
      <PopupWrapper isOpen={isAreYouSurePopupOpen}>
        <H3>Are you sure you want to delete this stopwatch?</H3>
        <p>This will delete the stopwatch and ALL it's entries.</p>
        <p className="mb-4 font-semibold">This action is irreversible</p>
        <HorizontalFlexWrapper className="gap-2">
          <Button onClick={() => setIsAreYouSurePopupOpen(false)}>No</Button>
          <Button
            onClick={() => {
              stopwatchToBeDeleted &&
                handleDeleteStopwatch(stopwatchToBeDeleted);
              setIsAreYouSurePopupOpen(false);
            }}
            type="reset"
          >
            I'm sure
          </Button>
        </HorizontalFlexWrapper>
      </PopupWrapper>
    </>
  );
}
