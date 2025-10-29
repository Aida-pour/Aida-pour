# ⚡ Quick Start Guide

Get up and running with Penglish in 5 minutes!

## Prerequisites Check

```bash
node --version   # Should be 18.0 or higher
npm --version    # Should be 9.0 or higher
```

## One-Command Setup (Mac/Linux)

```bash
# From the penglish-platform directory
./setup.sh
```

## Manual Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Edit .env if you have an OpenAI API key
# nano .env

# Initialize database
npm run prisma:generate
npm run prisma:migrate

# Start backend server
npm run dev
```

Backend should be running on http://localhost:5001

### 2. Frontend Setup (New Terminal)

```bash
cd frontend
npm install

# Start frontend dev server
npm run dev
```

Frontend should be running on http://localhost:3000

### 3. Open Browser

Navigate to http://localhost:3000 and start learning Farsi!

## Quick Test

1. Click on "Unit 1: Salam va Moghademaat"
2. Click on the first lesson "Salam!"
3. Complete the exercises
4. See your XP grow!

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Issues

```bash
cd backend
rm -rf prisma/migrations
rm ../penglish.db
npm run prisma:migrate
```

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

- **Hot Reload**: Both frontend and backend support hot reload
- **Database UI**: Run `npm run prisma:studio` in backend folder
- **API Testing**: Backend runs on http://localhost:5001/api/health
- **Logs**: Check terminal output for errors

## Next Steps

- [ ] Explore all lessons
- [ ] Try different exercise types
- [ ] Check your XP and level progress
- [ ] Read the full README for advanced features
- [ ] Consider contributing new lessons!

## Need Help?

- Check [README.md](README.md) for detailed documentation
- Look at [PENGLISH_PLATFORM_ARCHITECTURE.md](../PENGLISH_PLATFORM_ARCHITECTURE.md) for architecture
- Open an issue on GitHub

Happy Learning! 🎉
