import { Fragment } from "react/jsx-runtime"


export const TitleBar = ({ title, actions }: { title:any, actions:any[] }) => {

    return <div className="flex align-middle flex-wrap gap-5 justify-center">
        <h1 className="text-5xl font-bold">{title}</h1>
        <div className="flex-1 justify-between flex">
            <div />
            <div className="flex">
                {actions.map((action, i) => <Fragment key={i}>{action}</Fragment>)}
            </div>
        </div>
    </div>

}