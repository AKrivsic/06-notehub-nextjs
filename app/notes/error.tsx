'use client'

type Props = {
  error: Error;
};

const ErrorComponent = ({error}:Props) => {
    return (

            <p>Could not fetch the list of notes. {error.message}</p>

    )
}

export default ErrorComponent



// 'use client';

// type Props = {
//   error: Error;
// };

// const Error = ({ error }: Props) => {
//   return (
//     <div>
//       <p>Could not fetch the list of notes. {error.message}</p>
//     </div>
//   );
// }

// export default Error;

// export default function ErrorPage({ error }: Props) {
//   return <p>Could not fetch the list of notes. {error.message}</p>;
// }