import type { Speaker } from "../../scripts/api/sessionize_api";

const SpeakerPreviewElement = ({ speaker }: { speaker: Speaker }) => (
    <a
    href={`/speakers/${speaker.slug}`}
    className="card border-black border-4 bg-base-200 hover:bg-base-300 h-full w-full shadow-md hover:shadow-lg flex flex-col items-center text-center duration-150 ease-in"
  >
    <figure>
      <img
        src={speaker.profilePicture}
        alt={speaker.fullName}
      />
    </figure>
    <div className="card-body p-4">
      <p className="my-2 font-medium text-lg">{speaker.fullName}</p>
      <p className="max-h-12 text-ellipsis overflow-hidden">{speaker.tagLine}</p>
    </div>
    </a>
)

export const RandomSpeakerList = ({ speakers }:{ speakers:Speaker[] }) => {
    return <>{speakers.sort(() => Math.random() - 0.5).slice(0, 4).map((s) => (
        <div className="mx-auto flex gap-8">
            <SpeakerPreviewElement speaker={s} />
        </div>
    ))}</>
}


