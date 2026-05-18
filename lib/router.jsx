import * as React from "react";

const RouterContext = React.createContext(null);

function normalizePath(path) {
  return path || "/";
}

export function RouterProvider({ children }) {
  const [pathname, setPathname] = React.useState(() => window.location.pathname || "/");

  React.useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname || "/");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const push = React.useCallback((href) => {
    const nextPath = normalizePath(href);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
      setPathname(nextPath);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  const value = React.useMemo(() => ({ pathname, push }), [pathname, push]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used inside RouterProvider");
  }
  return { push: context.push };
}

export function usePathname() {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error("usePathname must be used inside RouterProvider");
  }
  return context.pathname;
}

export function Link({ href, children, onClick, ...props }) {
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey ||
          props.target === "_blank"
        ) {
          return;
        }
        event.preventDefault();
        router.push(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
