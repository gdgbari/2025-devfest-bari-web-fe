import type { Speaker } from "../../scripts/api/sessionize_api";

const SpeakerPreviewElement = ({ speaker }: { speaker: Speaker }) => (
  <a
    key={speaker.id}
    href={`/speakers/${speaker.slug}`}
    className="speaker-card"
  >
    <figure>
      <img
        className="rounded-none"
        src={speaker.profilePicture}
        alt={speaker.fullName}
      />
    </figure>
    <div className="card-body p-4">
      <p className="my-2 font-medium text-xl">{speaker.fullName}</p>
      <p className="max-h-12 text-ellipsis overflow-hidden">{speaker.tagLine}</p>
    </div>
  </a>
)

export const RandomSpeakerList = ({ speakers }: { speakers: Speaker[] }) => {
  return <>{speakers.sort(() => Math.random() - 0.5).slice(0, 4).map((s) => (
    <div className="mx-auto">
      <SpeakerPreviewElement speaker={s} key={s.id} />
    </div>
  ))}</>
}


