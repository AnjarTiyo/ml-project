.PHONY: help install run clean frontend test-api stop-server

# Deteksi OS untuk perintah yang berbeda
ifeq ($(OS),Windows_NT)
    PYTHON := python
    VENV_ACTIVATE := venv\Scripts\activate
    VENV_BIN := venv\Scripts
    RM := rmdir /s /q
    OPEN := start
else
    UNAME_S := $(shell uname -s)
    PYTHON := python3
    VENV_ACTIVATE := venv/bin/activate
    VENV_BIN := venv/bin
    RM := rm -rf
    ifeq ($(UNAME_S),Darwin)
        OPEN := open
    else
        OPEN := xdg-open
    endif
endif

# Warna untuk output (Unix-like systems)
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Menampilkan bantuan untuk setiap perintah
	@echo "============================================"
	@echo "  UMKM Semarang ML - Makefile Commands"
	@echo "============================================"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "Contoh penggunaan:"
	@echo "  make install    # Install dependencies"
	@echo "  make run        # Jalankan backend server"
	@echo "  make frontend   # Buka frontend di browser"
	@echo ""

install: ## Install dependencies dan setup virtual environment
	@echo "$(GREEN)Creating virtual environment...$(NC)"
	$(PYTHON) -m venv venv
	@echo "$(GREEN)Installing dependencies...$(NC)"
ifeq ($(OS),Windows_NT)
	$(VENV_BIN)\pip install --upgrade pip
	$(VENV_BIN)\pip install -r requirements.txt
else
	./$(VENV_BIN)/pip install --upgrade pip
	./$(VENV_BIN)/pip install -r requirements.txt
endif
	@echo "$(GREEN)✓ Installation complete!$(NC)"
	@echo ""
	@echo "Gunakan 'make run' untuk menjalankan backend"

run: ## Jalankan backend server (http://127.0.0.1:8000)
	@echo "$(GREEN)Starting backend server...$(NC)"
	@echo "Server akan berjalan di: http://127.0.0.1:8000"
	@echo "Tekan Ctrl+C untuk menghentikan server"
	@echo ""
ifeq ($(OS),Windows_NT)
	cd backend && ..\$(VENV_BIN)\uvicorn main:app --reload --host 127.0.0.1 --port 8000
else
	cd backend && ../$(VENV_BIN)/uvicorn main:app --reload --host 127.0.0.1 --port 8000
endif

frontend: ## Buka frontend di browser
	@echo "$(GREEN)Opening frontend in browser...$(NC)"
	$(OPEN) frontend/index.html

test-api: ## Test API endpoint (GET /)
	@echo "$(GREEN)Testing API endpoint...$(NC)"
	@curl -s http://127.0.0.1:8000/ | python3 -m json.tool || echo "$(RED)Error: Pastikan backend sudah berjalan dengan 'make run'$(NC)"

stop-server: ## Hentikan server yang berjalan di port 8000
	@echo "$(YELLOW)Stopping server on port 8000...$(NC)"
ifeq ($(OS),Windows_NT)
	@for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /F /PID %%a 2>nul || echo "No process found on port 8000"
else
	@lsof -ti:8000 | xargs kill -9 2>/dev/null || echo "No process found on port 8000"
endif
	@echo "$(GREEN)✓ Server stopped$(NC)"

clean: ## Hapus virtual environment dan cache files
	@echo "$(YELLOW)Cleaning up...$(NC)"
	$(RM) venv 2>/dev/null || true
	$(RM) backend/__pycache__ 2>/dev/null || true
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete!$(NC)"

reinstall: clean install ## Reinstall (clean + install)

dev: ## Jalankan backend dan buka frontend sekaligus (Unix-like systems only)
	@echo "$(GREEN)Starting development environment...$(NC)"
	@echo "Backend: http://127.0.0.1:8000"
	@echo ""
	@$(MAKE) frontend &
	@sleep 2
	@$(MAKE) run

check-deps: ## Cek apakah semua dependencies terinstall
	@echo "$(GREEN)Checking dependencies...$(NC)"
ifeq ($(OS),Windows_NT)
	@$(VENV_BIN)\python -c "import fastapi, uvicorn, skfuzzy, joblib, numpy, scipy, sklearn; print('✓ All dependencies installed')" || echo "$(RED)Error: Run 'make install' first$(NC)"
else
	@./$(VENV_BIN)/python -c "import fastapi, uvicorn, skfuzzy, joblib, numpy, scipy, sklearn; print('✓ All dependencies installed')" 2>/dev/null || echo "$(RED)Error: Run 'make install' first$(NC)"
endif

update: ## Update dependencies ke versi terbaru
	@echo "$(GREEN)Updating dependencies...$(NC)"
ifeq ($(OS),Windows_NT)
	$(VENV_BIN)\pip install --upgrade -r requirements.txt
else
	./$(VENV_BIN)/pip install --upgrade -r requirements.txt
endif
	@echo "$(GREEN)✓ Dependencies updated!$(NC)"
