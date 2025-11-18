type JsocErrorFallbackProps = {
  error: Error;
};


export function JsocErrorFallback ({error}: JsocErrorFallbackProps) {
    return (
        <>
            <h2>
                {error.name}
            </h2>
            <h4>
                {error.message}
            </h4>
        </>
    )
}