class Program
{
    static void Main(string[] args)
    {
        int a = int.Parse(Console.ReadLine());
        int count = 0;

        while (a > 0)
        {
            if(a % 2 == 1)
            {
                count++;
            }
            a /= 2;
        }
        Console.WriteLine(count);
    }
}