package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"
)

func getClientIP(r *http.Request) string {
	ip := r.Header.Get("X-Forwarded-For")
	if ip != "" {
		return strings.Split(ip, ",")[0]
	}
	ip = r.Header.Get("X-Real-IP")
	if ip != "" {
		return ip
	}
	return strings.Split(r.RemoteAddr, ":")[0]
}

func redirectHandler(w http.ResponseWriter, r *http.Request) {
	newURL := "https://mykalmachon.com" + r.URL.Path
	if r.URL.RawQuery != "" {
		newURL += "?" + r.URL.RawQuery
	}

	requestedURL := r.URL.String()
	if r.Host != "" {
		requestedURL = "https://" + r.Host + requestedURL
	}

	slog.Info(fmt.Sprintf("🐸 redirecting %s to %s", requestedURL, newURL),
		"ip", getClientIP(r),
		"user_agent", r.Header.Get("User-Agent"),
		"requested_url", requestedURL,
		"redirected_url", newURL,
	)

	http.Redirect(w, r, newURL, http.StatusMovedPermanently)
}

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", redirectHandler)

	slog.Info("🐸 server starting", "port", port, "target", "https://mykalmachon.com")

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		slog.Error("🐸 server failed to start", "error", err)
	}
}
