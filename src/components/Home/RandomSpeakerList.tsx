import type { Speaker } from "../../data/types/sessionize";
import { getLangFromUrl, useTranslatedPath, useTranslations } from "../../i18n/utils";

const SpeakerPreviewElement = ({ speaker }: { speaker: Speaker }) => {
  const lang = getLangFromUrl(new URL(location.href));
  const getPath = useTranslatedPath(lang);
  return <a
    key={speaker.id}
    href={getPath(`/speakers/${speaker.slug}`)}
    className="speaker-card"
  >
    <figure>
      <img
        className="rounded-none w-full aspect-square"
        src={speaker.profilePicture}
        alt={speaker.fullName}
      />
    </figure>
    <div className="card-body p-4">
      <p className="font-medium text-xl">{speaker.fullName}</p>
      <p className="max-h-12 text-ellipsis overflow-hidden">{speaker.tagLine}</p>
    </div>
  </a>
}

export const RandomSpeakerList = ({ speakers }:{ speakers:Speaker[] }) => {
    return <>{speakers.sort(() => Math.random() - 0.5).slice(0, 4).map((s) => (
        <div className="mx-auto" key={s.id}>
            <SpeakerPreviewElement speaker={s} />
        </div>
    ))}</>
}


