import React from 'react';
import './App.css';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <div className="App">
      <div style={{display: 'flex', justifyContent:'center',width:'100vw',height:'100vh'}}>
        <div style={{margin:'auto'}}>
          <ErrorBoundary fallback={<p>error in handle</p>}>
            use react-error-boundary, and use useErrorBoundary
            {/* react-error-boundary を使えば、handler もいけるといったがだめ */}
            <A/>
          </ErrorBoundary>
        </div>
        <div style={{margin:'auto'}}>
          use react-error-boundary, simple wrap
          <ErrorBoundary fallback={<p>error</p>}>
            <B/>
          </ErrorBoundary>
        </div>
        <div style={{margin:'auto'}}>
          use react-error-boundary, error rendering
          <ErrorBoundary fallback={<p>error rendering</p>}>
            <C/>
          </ErrorBoundary>
        </div>
        <div style={{margin:'auto'}}>
          use react-error-boundary, error useEffect
          <ErrorBoundary fallback={<p>error useEffect</p>}>
            <D/>
          </ErrorBoundary>
        </div>

      </div>
    </div>
  );
}

const A: React.FC = () => {
  const { showBoundary } = useErrorBoundary();

  // showBoundary を内包する薄いラッパー
  const wrapCatchError = <Args extends unknown[]>(fn: (...args: Args) => void) => (...args: Args) => {
    try {
      fn(...args);
    } catch (error) {
      showBoundary(error);
    }
  };

  const searchV2 = wrapCatchError((event: React.FormEvent<HTMLFormElement>) => {
    // しないとリロードされる
    event.preventDefault();
    throw new Error("search error");
  });

  function search(event: React.FormEvent<HTMLFormElement>) {
    try {
      // しないとリロードされる
      event.preventDefault();

      throw new Error("search error");
    } catch (error) {
      showBoundary(error);
    }
  }

  return (
    <form onSubmit={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  )
}

// https://ja.react.dev/reference/react-dom/components/form#handling-form-submission-errors
// ここによると、エラーキャッチしてみるみたいだけど、実際はキャッチできてない
const B: React.FC = () => {
  function search(event: React.FormEvent<HTMLFormElement>) {
    // しないとリロードされる
    event.preventDefault();

    throw new Error("search error");
  }

  return (
    <form onSubmit={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  )
}

const C: React.FC = () => {
  // ここでエラーを発生させる
  throw new Error("error render");

  return (
    <div>hello</div>
  )
}

const D: React.FC = () => {
  React.useEffect(() => {
    throw new Error("error useEffect");
  }, []);

  return (
    <div>hello</div>
  )
}

export default App;
