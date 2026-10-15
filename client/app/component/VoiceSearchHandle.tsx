import { GrMicrophone } from "react-icons/gr";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useVoiceSearch } from "../hooks/voiceSearch";
import { VoiceSearchPropType } from "@/types";

const VoiceSearchHandle = ({
  setSearchQuery,
  setIsRecording,
  setTopic,
}: VoiceSearchPropType) => {
  const { handleVoiceSearch } = useVoiceSearch({
    setSearchQuery,
    setIsRecording,
    setTopic,
  });

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleVoiceSearch}
            className="items-center h-[2.5rem] p-2 rounded-full bg-lightSlaty border border-slaty/30 hover:bg-slaty/30"
          >
            <GrMicrophone className="text-xl text-slaty/5" />
          </button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            className="z-50 px-3 py-2 rounded text-slaty text-sm bg-lightSlaty shadow-md"
          >
            Search with your voice
            <Tooltip.Arrow className="fill-lightSlaty" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default VoiceSearchHandle;
