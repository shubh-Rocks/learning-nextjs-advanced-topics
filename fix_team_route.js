const fs = require('fs');
const filePath = 'app/api/user/[userId]/team/route.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the validation logic with proper error handling
const oldValidation = `const { teamId } = await request.json();

    if (teamId) {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        return NextResponse.json(
          {
            error: "Team not found ",
          },
          { status: 404 },
        );
      }
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: {
        teamId: teamId,
      },
      include: {
        team: true,
      },
    });`;

const newValidation = `const { teamId } = await request.json();

    // Validate teamId if provided
    if (teamId !== null && teamId !== undefined) {
      if (typeof teamId !== 'string' || teamId.trim() === '') {
        return NextResponse.json(
          { error: "Invalid teamId format" },
          { status: 400 },
        );
      }

      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        return NextResponse.json(
          { error: "Team not found" },
          { status: 404 },
        );
      }
    }

    // Use null instead of undefined for clearing teamId
    const updateData = {
      teamId: teamId === undefined ? null : teamId,
    };

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        team: true,
      },
    });`;

content = content.replace(oldValidation, newValidation);
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ Fixed team assignment validation in route.ts');
